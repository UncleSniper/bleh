const term = require('./terminal.js');
const clic = require('cli-color');
const readline = require('readline');


class ConsoleTerminal extends term.Terminal {

	constructor() {
		super();
	}

	start() {
		/*
		if(!process.stdin.isTTY)
			//TODO: die
		if(!process.stdout.isTTY)
			//TODO: die
		*/
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);
		process.stdin.on('keypress', (str, key) => {
			this.emit('keypress', str, key);
		});
	}

	stop() {
		process.stdin.setRawMode(false);
	}

}

module.exports = ConsoleTerminal;
