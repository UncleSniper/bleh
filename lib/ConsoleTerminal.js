'use strict';

const readline = require('readline');
const winsize = require('window-size');
const except = require('node-exceptions');

const Terminal = require('./Terminal.js');
const Key = Terminal.Key;
const SequenceMap = require('./SequenceMap.js');
const KeyPressToKeyConverter = require('./KeyPressToKeyConverter.js');
const NotATerminalException = require('./NotATerminalException.js');
const ClipStackUnderrunException = require('./ClipStackUnderrunException.js');
const termdb = require('./termdb.js');

class Desire {

	constructor(text, fg, bg, attributes) {
		this.text = text;
		this.fg = fg;
		this.bg = bg;
		this.attributes = attributes;
	}

	sameAttributesAs(other) {
		return this.fg == other.fg && this.bg == other.bg && this.attributes == other.attributes;
	}

	matchesAttributes(fg, bg, attributes) {
		return this.fg == fg && this.bg == bg && this.attributes == attributes;
	}

}

Desire.ALL_ATTRIBUTES
	= Terminal.BOLD
	| Terminal.DIM
	| Terminal.STANDOUT
	| Terminal.UNDERLINE
	| Terminal.BLINK
	| Terminal.REVERSE
	| Terminal.HIDDEN

const LINEBREAK_RE = /(?:\r?\n|\r)/;

class ConsoleTerminal extends Terminal {

	constructor(type, warningChannel) {
		super();
		this._width = winsize.width;
		this._height = winsize.height;
		process.stdout.on('resize', () => {
			var oldWidth = this._width, oldHeight = this._height;
			this.updateSize();
			this.emit('resize', this._width, this._height, oldWidth, oldHeight);
		});
		if(!type)
			type = process.env.TERM;
		if(!type || !termdb.db[type]) {
			(warningChannel ? warningChannel : process.stderr.write.bind(process.stderr))("bleh: "
					+ "Unknown terminal type" + (type ? " '" + type + "'" : '')
					+ ", defaulting to '" + ConsoleTerminal.DEFAULT_TYPE + "'.\n");
			type = ConsoleTerminal.DEFAULT_TYPE;
		}
		this._specifier = termdb.db[type];
		if(!this._specifier)
			this._specifier = Object.create(null);
		var mkkeyconv = this._specifier.keyConverter;
		this.keyConverter = mkkeyconv && mkkeyconv();
		if(!this.keyConverter)
			this.keyConverter = new KeyPressToKeyConverter();
		this.rawKeyInterceptors = [];
		this.autoFlushInput = true;
		this._desiredLines = [];
		const emptyLine = ' '.repeat(this._width);
		var i;
		for(i = 0; i < this._height; ++i)
			this._desiredLines.push(this.width ? [new Desire(emptyLine, 7, 0, 0)] : []);
		this.clipStack = [];
		this._fg = 7;
		this._bg = 0;
		this._attributes = 0;
		this.row = this.column = 0;
	}

	start() {
		if(!process.stdin.isTTY)
			throw new NotATerminalException('stdin');
		if(!process.stdout.isTTY)
			throw new NotATerminalException('stdout');
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);
		process.stdin.on('keypress', (name, info) => {
			this.emit('keypress', name, info);
			this._onKey(name, info);
		});
	}

	stop() {
		process.stdin.setRawMode(false);
	}

	updateSize() {
		const spec = winsize.get();
		this._width = spec.width;
		this._height = spec.height;
	}

	get width() {
		return this._width;
	}

	set width(width) {
		throw new except.DomainException('Cannot set terminal width');
	}

	get height() {
		return this._height;
	}

	set height(height) {
		throw new except.DomainException('Cannot set terminal height');
	}

	_decodeKeys(name, info) {
		var keys, key = ConsoleTerminal._convertPreDecodedKey(name, info);
		if(key) {
			this.keyConverter.flushSequences();
			keys = this.keyConverter.fetchKeys();
			keys.push(key);
		}
		else if(info.sequence) {
			this.keyConverter.feedInput(info.sequence);
			if(this.autoFlushInput)
				this.keyConverter.flushSequences();
			keys = this.keyConverter.fetchKeys();
		}
		else
			keys = [];
		return keys;
	}

	_onKey(name, info) {
		var i, interceptor, propagate = true, keys;
		for(i = 0; i < this.rawKeyInterceptors.length; ++i) {
			interceptor = this.rawKeyInterceptors[i];
			if(interceptor && !interceptor(name, info))
				propagate = false;
		}
		if(propagate) {
			keys = this._decodeKeys(name, info);
			if(keys && keys.length)
				this.emit('keys', keys);
		}
	}

	pushRawKeyInterceptor(interceptor) {
		this.rawKeyInterceptors.unshift(interceptor);
	}

	popRawKeyInterceptor() {
		return this.rawKeyInterceptors.length ? this.rawKeyInterceptors.shift() : undefined;
	}

	removeRawKeyInterceptor(interceptor) {
		var i;
		for(i = 0; i < this.rawKeyInterceptors.length; ++i) {
			if(this.rawKeyInterceptors[i] === interceptor) {
				this.rawKeyInterceptors.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	pushClip(rect) {
		if(this.clipStack.length)
			this.clipStack.push(this.clipStack[this.clipStack.length - 1].intersect(rect));
		else
			this.clipStack.push(rect);
	}

	popClip() {
		if(this.clipStack.length)
			return this.clipStack.pop();
		else
			throw new ClipStackUnderrunException();
	}

	effectiveClip() {
		const size = new Rect(0, 0, this._width, this._height);
		if(this.clipStack.length)
			return this.clipStack[this.clipStack.length - 1].intersect(size);
		else
			return size;
	}

	getFG() {
		return this._fg;
	}

	setFG(fg) {
		return this._fg = this._specifier.prepareColor(fg);
	}

	getBG() {
		return this._bg;
	}

	setBG(bg) {
		return this._bg = this._specifier.prepareColor(bg);
	}

	getAttributes() {
		return this._attributes;
	}

	setAttributes(attributes) {
		return this._attributes = attributes & Desire.ALL_ATTRIBUTES;
	}

	move(column, row) {
		this.column = column;
		this.row = row;
	}

	write(text) {
		const lines = text.split(LINEBREAK_RE);
		const bounds = this.effectiveClip();
		var i;
		for(i = 0; i < lines.length; ++i) {
			if(i) {
				++this.row;
				this.column = 0;
			}
			this._write(lines[i], bounds);
		}
	}

	_write(text, bounds) {
		if(!text.length)
			return;
		if(this.row < bounds.y1 || this.row >= bounds.y2)
			return;
		if(this.column >= bounds.x2)
			return;
		var skip;
		if(this.column < bounds.x1) {
			skip = bounds.x1 - this.column;
			if(skip >= text.length)
				return;
			text = text.substr(skip);
			this.column += skip;
		}
		if(this.column + text.length > this._width)
			text = text.substr(0, this._width - this.column);
		const dirtStart = this.row * this._width + this.column;
		const dline = this._desiredLines[this.row];
		var skipWidth = 0, desire = null;
		for(skip = 0; skip < dline.length; ++skip) {
			desire = dline[skip];
			if(skipWidth + desire.text.length > this.column)
				break;
			skipWidth += desire.text.length;
		}
		var skipOffset = this.column - skipWidth;
		var dwidth, checkMergeForward, checkMergeBackward, nextDesire, tailDesire, prevDesire;
		for(;;) {
			dwidth = desire.text.length;
			checkMergeForward = checkMergeBackward = false;
			// match: covers entire desire? => replace
			if(!skipOffset && text.length >= dwidth) {
				desire.text = text.substr(0, dwidth);
				desire.fg = this._fg;
				desire.bg = this._bg;
				desire.attributes = this._attributes;
				text = text.substr(dwidth);
				this.column += dwidth;
				skipWidth += dwidth;
				checkMergeForward = checkMergeBackward = true;
			}
			// covers suffix of desire?
			else if(skipOffset && skipOffset + text.length >= dwidth) {
				// same attributes? => alter
				if(desire.matchesAttributes(this._fg, this._bg, this._attributes)) {
					desire.text = desire.text.substr(0, skipOffset) + text.substring(skipOffset, dwidth);
					this.column += dwidth - skipOffset;
					text = text.substr(dwidth);
					if(!text.length)
						break;
					skipOffset = 0;
					skipWidth += dwidth;
					desire = dline[++skip];
					continue;
				}
				// different attributes => split
				else {
					// will trigger merge forward? => move
					if(skip + 1 < dline.length && (nextDesire = dline[skip + 1])
							.matchesAttributes(this._fg, this._bg, this._attributes)) {
						desire.text = desire.text.substr(0, skipOffset);
						nextDesire.text = text.substr(dwidth - skipOffset) + nextDesire.text;
						skipWidth += skipOffset;
						skipOffset = 0;
						++skip;
						desire = nextDesire;
						continue;
					}
					// will not trigger merge forward => split forward
					else {
						nextDesire = new Desire(skipOffset + text.length > dwidth
								? text.substring(skipOffset, dwidth) : text, this._fg, this._bg, this._attributes);
						desire.text = desire.text.substr(0, skipOffset);
						text = text.substr(nextDesire.text.length);
						dline.splice(skip + 1, 0, nextDesire);
						this.column = skipWidth + desire.text.length + nextDesire.text.length;
						if(!text.length)
							break;
						skipOffset = 0;
						skipWidth = this.column;
						desire = dline[skip += 2];
						continue;
					}
				}
			}
			// covers prefix of desire?
			else if(!skipOffset && text.length < dwidth) {
				// same attributes? => alter
				if(desire.matchesAttributes(this._fg, this._bg, this._attributes)) {
					desire.text = text + desire.text.substr(text.length);
					this.column += text.length;
					break;
				}
				// different attributes => split
				else {
					nextDesire = new Desire(text, this._fg, this._bg, this._attributes);
					desire.text = desire.text.substr(text.length);
					dline.splice(skip, 0, nextDesire);
					this.column += text.length;
					text = '';
					checkMergeBackward = true;
				}
			}
			// covers infix of desire
			else {
				// same attributes? => alter
				if(desire.matchesAttributes(this._fg, this._bg, this._attributes)) {
					desire.text = desire.text.substr(0, skipOffset) + text
							+ desire.text.substr(skipOffset + text.length);
					break;
				}
				// different attributes => split
				else {
					nextDesire = new Desire(text, this._fg, this._bg, this._attributes);
					tailDesire = new Desire(desire.text.substr(skipOffset + text.length),
							desire.fg, desire.bg, desire.attributes);
					desire.text = desire.text.substr(0, skipOffset);
					dline.splice(skip, 1, desire, nextDesire, tailDesire);
					break;
				}
			}
			// now check for merges
			if(checkMergeBackward && skip) {
				prevDesire = dline[skip - 1];
				if(desire.sameAttributesAs(prevDesire)) {
					prevDesire.text += desire.text;
					dline.splice(skip, 1);
					desire = prevDesire;
				}
			}
			if(text.length)
				continue;
			if(checkMergeForward && skip + 1 < dline.length) {
				nextDesire = dline[skip + 1];
				if(desire.sameAttributesAs(nextDesire)) {
					desire.text += nextDesire.text;
					dline.splice(skip + 1, 1);
				}
			}
			break;
		}
	}

	static _convertPreDecodedKey(name, info) {
		if(!info.name)
			return null;
		var modifiers = 0;
		if(info.ctrl)
			modifiers |= Key.CTRL;
		if(info.meta)
			modifiers |= Key.ALT;
		if(info.shift)
			modifiers |= Key.SHIFT;
		if(info.name.length == 1 && info.name >= 'a' && info.name <= 'z') {
			switch(modifiers) {
				case Key.CTRL:
					if('ihjm'.indexOf(info.name) >= 0)
						break;
				case Key.ALT:
				case Key.SHIFT | Key.ALT:
					return new Key(Key.GENERIC, modifiers, info.name);
			}
		}
		return ConsoleTerminal._PREDECODED_MAP[modifiers + ':' + info.name] || null;
	}

	static mapPreDecoded() {
		return {
			map: function(infoName, infoModifiers, keyType, keyModifiers, keyValue) {
				ConsoleTerminal._PREDECODED_MAP[infoModifiers + ':' + infoName]
						= new Key(keyType, keyModifiers, keyValue);
				return this;
			}
		};
	}

}

ConsoleTerminal.Desire = Desire;

ConsoleTerminal.DEFAULT_TYPE = 'xterm';

ConsoleTerminal.NotATerminalException = NotATerminalException;

ConsoleTerminal._PREDECODED_MAP = Object.create(null);

ConsoleTerminal.mapPreDecoded()
	.map('backspace', 0, Key.GENERIC, 0, '\b')
	.map('backspace', Key.ALT, Key.GENERIC, Key.ALT, '\b')
	.map('f1', 0, Key.FUNCTION, 0, 1)
	.map('f2', 0, Key.FUNCTION, 0, 2)
	.map('f3', 0, Key.FUNCTION, 0, 3)
	.map('f4', 0, Key.FUNCTION, 0, 4)
	.map('f5', 0, Key.FUNCTION, 0, 5)
	.map('f6', 0, Key.FUNCTION, 0, 6)
	.map('f7', 0, Key.FUNCTION, 0, 7)
	.map('f8', 0, Key.FUNCTION, 0, 8)
	.map('f9', 0, Key.FUNCTION, 0, 9)
	.map('f10', 0, Key.FUNCTION, 0, 10)
	.map('f11', 0, Key.FUNCTION, 0, 11)
	.map('f12', 0, Key.FUNCTION, 0, 12)
	.map('up', 0, Key.UP, 0, null)
	.map('down', 0, Key.DOWN, 0, null)
	.map('left', 0, Key.LEFT, 0, null)
	.map('right', 0, Key.RIGHT, 0, null)
	.map('up', Key.ALT, Key.UP, Key.ALT, null)
	.map('down', Key.ALT, Key.DOWN, Key.ALT, null)
	.map('left', Key.ALT, Key.LEFT, Key.ALT, null)
	.map('right', Key.ALT, Key.RIGHT, Key.ALT, null)
	.map('up', Key.CTRL, Key.UP, Key.CTRL, null)
	.map('down', Key.CTRL, Key.DOWN, Key.CTRL, null)
	.map('left', Key.CTRL, Key.LEFT, Key.CTRL, null)
	.map('right', Key.CTRL, Key.RIGHT, Key.CTRL, null)
	.map('up', Key.CTRL | Key.ALT, Key.UP, Key.CTRL | Key.ALT, null)
	.map('down', Key.CTRL | Key.ALT, Key.DOWN, Key.CTRL | Key.ALT, null)
	.map('left', Key.CTRL | Key.ALT, Key.LEFT, Key.CTRL | Key.ALT, null)
	.map('right', Key.CTRL | Key.ALT, Key.RIGHT, Key.CTRL | Key.ALT, null)
	.map('up', Key.ALT | Key.SHIFT, Key.UP, Key.ALT | Key.SHIFT, null)
	.map('down', Key.ALT | Key.SHIFT, Key.DOWN, Key.ALT | Key.SHIFT, null)
	.map('left', Key.ALT | Key.SHIFT, Key.LEFT, Key.ALT | Key.SHIFT, null)
	.map('right', Key.ALT | Key.SHIFT, Key.RIGHT, Key.ALT | Key.SHIFT, null)
	.map('up', Key.CTRL | Key.SHIFT, Key.UP, Key.CTRL | Key.SHIFT, null)
	.map('down', Key.CTRL | Key.SHIFT, Key.DOWN, Key.CTRL | Key.SHIFT, null)
	.map('left', Key.CTRL | Key.SHIFT, Key.LEFT, Key.CTRL | Key.SHIFT, null)
	.map('right', Key.CTRL | Key.SHIFT, Key.RIGHT, Key.CTRL | Key.SHIFT, null)
	.map('delete', 0, Key.DELETE, 0, null)
	.map('insert', 0, Key.INSERT, 0, null)
	.map('delete', Key.SHIFT, Key.DELETE, Key.SHIFT, null)
	.map('delete', Key.CTRL, Key.DELETE, Key.CTRL, null)
	.map('delete', Key.ALT, Key.DELETE, Key.ALT, null)
	.map('insert', Key.ALT, Key.INSERT, Key.ALT, null)
	.map('delete', Key.SHIFT | Key.CTRL, Key.DELETE, Key.SHIFT | Key.CTRL, null)
	.map('delete', Key.SHIFT | Key.ALT, Key.DELETE, Key.SHIFT | Key.ALT, null)
	.map('insert', Key.CTRL | Key.ALT, Key.INSERT, Key.CTRL | Key.ALT, null)
	.map('insert', Key.CTRL | Key.SHIFT | Key.ALT, Key.INSERT, Key.CTRL | Key.SHIFT | Key.ALT, Key.INSERT, null)
	.map('home', 0, Key.HOME, 0, null)
	.map('end', 0, Key.END, 0, null)
	.map('home', Key.CTRL, Key.HOME, Key.CTRL, null)
	.map('end', Key.CTRL, Key.END, Key.CTRL, null)
	.map('home', Key.ALT, Key.HOME, Key.ALT, null)
	.map('end', Key.ALT, Key.END, Key.ALT, null)
	.map('home', Key.CTRL | Key.ALT, Key.HOME, Key.CTRL | Key.ALT, null)
	.map('end', Key.CTRL | Key.ALT, Key.END, Key.CTRL | Key.ALT, null)
	.map('home', Key.CTRL | Key.SHIFT, Key.HOME, Key.CTRL | Key.SHIFT, null)
	.map('end', Key.CTRL | Key.SHIFT, Key.END, Key.CTRL | Key.SHIFT, null)
	.map('home', Key.ALT | Key.SHIFT, Key.HOME, Key.ALT | Key.SHIFT, null)
	.map('end', Key.ALT | Key.SHIFT, Key.END, Key.ALT | Key.SHIFT, null)
	.map('home', Key.CTRL | Key.ALT | Key.SHIFT, Key.HOME, Key.CTRL | Key.ALT | Key.SHIFT, null)
	.map('end', Key.CTRL | Key.ALT | Key.SHIFT, Key.END, Key.CTRL | Key.ALT | Key.SHIFT, null)
	.map('pageup', 0, Key.PAGE_UP, 0, null)
	.map('pagedown', 0, Key.PAGE_DOWN, 0, null)
	.map('pageup', Key.CTRL, Key.PAGE_UP, Key.CTRL, null)
	.map('pagedown', Key.CTRL, Key.PAGE_DOWN, Key.CTRL, null)
	.map('pageup', Key.ALT, Key.PAGE_UP, Key.ALT, null)
	.map('pagedown', Key.ALT, Key.PAGE_DOWN, Key.ALT, null)
	.map('pageup', Key.CTRL | Key.ALT, Key.PAGE_UP, Key.CTRL | Key.ALT, null)
	.map('pagedown', Key.CTRL | Key.ALT, Key.PAGE_DOWN, Key.CTRL | Key.ALT, null)
	.map('pageup', Key.CTRL | Key.SHIFT, Key.PAGE_UP, Key.CTRL | Key.SHIFT, null)
	.map('pagedown', Key.CTRL | Key.SHIFT, Key.PAGE_DOWN, Key.CTRL | Key.SHIFT, null)
	.map('pageup', Key.ALT | Key.SHIFT, Key.PAGE_UP, Key.ALT | Key.SHIFT, null)
	.map('pagedown', Key.ALT | Key.SHIFT, Key.PAGE_DOWN, Key.ALT | Key.SHIFT, null)
	.map('pageup', Key.CTRL | Key.ALT | Key.SHIFT, Key.PAGE_UP, Key.CTRL | Key.ALT | Key.SHIFT, null)
	.map('pagedown', Key.CTRL | Key.ALT | Key.SHIFT, Key.PAGE_DOWN, Key.CTRL | Key.ALT | Key.SHIFT, null)
;

module.exports = ConsoleTerminal;
