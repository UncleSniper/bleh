const Terminal = require('./terminal.js');
const clic = require('cli-color');
const readline = require('readline');
const except = require('node-exceptions');
const winsize = require('window-size');
const termdb = require('./termdb.js');
const SequenceMap = require('./seqmap.js');

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
		this.specifier = termdb[type];
		if(!this.specifier)
			this.specifier = Object.create(null);
		this.keyMap = this.specifier.keyMap;
		if(!this.keyMap)
			this.keyMap = new SequenceMap();
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
			this.onKey(name, info);
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

	decodeKey(name, info) {
		if(!info.sequence)
			return null;
		var modifiers = 0;
		if(info.ctrl)
			modifiers = Terminal.Key.CTRL;
		if(info.meta)
			modifiers = Terminal.Key.ALT;
		if(info.shift)
			modifiers = Terminal.Key.SHIFT;
		//TODO
	}

	onKey(name, info) {
		var i, interceptor, propagate = true, key;
		for(i = 0; i < this.rawKeyInterceptors.length; ++i) {
			interceptor = this.rawKeyInterceptors[i];
			if(interceptor && !interceptor(name, info))
				propagate = false;
		}
		if(propagate) {
			key = this.decodeKey(name, info);
			if(key)
				this.emit('key', key);
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

}

ConsoleTerminal.DEFAULT_TYPE = 'xterm';
ConsoleTerminal.NotATerminalException = NotATerminalException;

module.exports = ConsoleTerminal;
