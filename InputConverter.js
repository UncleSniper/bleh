const MethodNotImplementedException = require('./MethodNotImplementedException.js');

class Stage {

	constructor() {}

	getCurrentKey() {
		throw new MethodNotImplementedException(this, 'getCurrentKey');
	}

	get currentKey() {
		return this.getCurrentKey();
	}

	isInputLeaf() {
		throw new MethodNotImplementedException(this, 'isInputLeaf');
	}

	get inputLeaf() {
		return this.isInputLeaf();
	}

	getNextStage(inputChar) {
		throw new MethodNotImplementedException(this, 'getNextStage');
	}

}

class InputConverter {

	constructor() {}

	newSequence() {
		throw new MethodNotImplementedException(this, 'newSequence');
	}

}

InputConverter.Stage = Stage;

module.exports = InputConverter;
