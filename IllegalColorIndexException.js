'use strict';

const except = require('node-exceptions');

class IllegalColorIndexException extends except.DomainException {

	constructor(color) {
		super('Illegal color index: ' + color);
		this.color = color;
	}

}

module.exports = IllegalColorIndexException;
