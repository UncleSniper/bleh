const Terminal = require('./terminal.js');
const Key = Terminal.Key;
const clic = require('cli-color');
const readline = require('readline');
const except = require('node-exceptions');
const winsize = require('window-size');
const termdb = require('./termdb.js');
const SequenceMap = require('./seqmap.js');
const KeyPressToKeyConverter = require('./console-keyconv.js');

class NotATerminalException extends except.RuntimeException {

	constructor(pts) {
		super(pts + ' is not a terminal');
		this.pts = pts;
	}

}

class ConsoleTerminal extends Terminal {

	constructor(type, warningChannel) {
		super();
		this.width = winsize.width;
		this.height = winsize.height;
		process.stdout.on('resize', () => {
			this.updateSize();
			this.emit('resize', this.width, this.height);
		});
		if(!type)
			type = process.env.TERM;
		if(!type || !termdb[type]) {
			(warningChannel ? warningChannel : process.stderr.write.bind(process.stderr))("bleh: "
					+ "Unknown terminal type" + (type ? " '" + type + "'" : '')
					+ ", defaulting to '" + ConsoleTerminal.DEFAULT_TYPE + "'\n");
			type = ConsoleTerminal.DEFAULT_TYPE;
		}
		this._specifier = termdb[type];
		if(!this._specifier)
			this._specifier = Object.create(null);
		var mkkeyconv = this._specifier.keyConverter;
		this.keyConverter = mkkeyconv && mkkeyconv();
		if(!this.keyConverter)
			this.keyConverter = new KeyPressToKeyConverter();
		this.keyConverter.discardedInputSink = chunk => {
			this.emit('inputDiscarded', chunk);
		};
		this.rawKeyInterceptors = [];
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
		this.width = spec.width;
		this.height = spec.height;
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

	static _convertPreDecodedKey(name, info) {
		//TODO
	}

}

ConsoleTerminal.DEFAULT_TYPE = 'xterm';
ConsoleTerminal.NotATerminalException = NotATerminalException;

module.exports = ConsoleTerminal;
