const MethodNotImplementedException = require('./MethodNotImplementedException.js');

class SingleCharConverter {

	constructor() {}

	charToKey(inputChar) {
		throw new MethodNotImplementedException(this, 'charToKey');
	}

}

module.exports = SingleCharConverter;
