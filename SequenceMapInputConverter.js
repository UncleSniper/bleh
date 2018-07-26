const SequenceMap = require('./SequenceMap.js');
const InputConverter = require('./InputConverter.js');

class NodeStage extends InputConverter.Stage {

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

module.exports = SequenceMapInputConverter;
