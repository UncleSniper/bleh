'use strict';

const except = require('node-exceptions');

class NotATerminalException extends except.RuntimeException {

	constructor(pts) {
		super(pts + ' is not a terminal');
		this.pts = pts;
	}

}

module.exports = NotATerminalException;
