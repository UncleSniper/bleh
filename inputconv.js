const Terminal = require('./terminal.js');
const Key = Terminal.Key;
const miscExcept = require('./misc-except.js');
const SequenceMap = require('./seqmap.js');

class Stage {

	constructor() {}

	getCurrentKey() {
		throw new miscExcept.MethodNotImplementedException(this, 'getCurrentKey');
	}

	get currentKey() {
		return Object.create(this.getCurrentKey());
	}

	isInputLeaf() {
		throw new miscExcept.MethodNotImplementedException(this, 'isInputLeaf');
	}

	get inputLeaf() {
		return this.isInputLeaf();
	}

	getNextStage(inputChar) {
		throw new miscExcept.MethodNotImplementedException(this, 'getNextStage');
	}

}

class InputConverter {

	constructor() {}

	newSequence() {
		throw new miscExcept.MethodNotImplementedException(this, 'newSequence');
	}

}

InputConverter.Stage = Stage;

class NodeStage extends Stage {

	constructor(node) {
		super();
		this.node = node;
	}

	getCurrentKey() {
		return this.node.value;
	}

	isInputLeaf() {
		return this.node.isLeaf;
	}

	getNextStage(inputChar) {
		const next = this.node.getChild(inputChar);
		return next ? new NodeStage(next) : null;
	}

}

class SequenceMapInputConverter extends InputConverter {

	constructor() {
		super();
		this.map = new SequenceMap();
	}

	newSequence() {
		return new NodeStage(this.map.root);
	}

}

SequenceMapInputConverter.NodeStage = NodeStage;

class SingleCharConverter {

	constructor() {}

	charToKey(inputChar) {
		throw new miscExcept.MethodNotImplementedException(this, 'charToKey');
	}

}

class MappingSingleCharConverter extends SingleCharConverter {

	constructor() {
		super();
		this.keys = Object.create(null);
	}

	putKey(inputChar, key) {
		this.keys[inputChar] = key;
		return this;
	}

	clearKeys() {
		this.keys = Object.create(null);
	}

	registerControlKeys() {
		var code, c;
		for(code = 97; code <= 122; ++code) {
			c = String.fromCharCode(code);
			if(c != 'm')
				this.keys[c] = new Key(Key.GENERIC, Key.CTRL, c);
		}
		return this;
	}

	charToKey(inputChar) {
		var key = this.keys[inputChar];
		return key ? Object.create(key) : null;
	}

}

MappingSingleCharConverter.CONTROL = new MappingSingleCharConverter().registerControlKeys();
MappingSingleCharConverter.ALTERNATE_BACKSPACE = new MappingSingleCharConverter()
		.putKey('\u007F', new Key(Key.GENERIC, 0, '\b'));

module.exports = {
	InputConverter,
	SequenceMapInputConverter,
	SingleCharConverter,
	MappingSingleCharConverter
};
