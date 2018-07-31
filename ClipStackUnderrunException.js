'use strict';

const except = require('node-exceptions');

class ClipStackUnderrunException extends except.RuntimeException {

	constructor() {
		super('Clip rectangle stack underrun');
	}

}

module.exports = ClipStackUnderrunException;
