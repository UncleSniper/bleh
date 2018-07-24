class KeyPressToKeyConverter {

	constructor() {
		this.inputConverters = [];
		this.singleByteConverters = [];
		this.stages = this.lastSymbol = null;
		this.lastLength = 0;
		this.chars = [];
		this.keyQueue = [];
		this.flushPointer = this.currentDepth = this.pathCount = 0;
	}

	addInputConverter(converter) {
		this.inputConverters.push(converter);
	}

	clearInputConverters() {
		this.inputConverters = [];
	}

	addSingleByteConverter(converter) {
		this.singleByteConverters.push(converter);
	}

	clearSingleByteConverters() {
		this.singleByteConverters = [];
	}

	nextKey() {
		return this.keyQueue.length ? this.keyQueue.shift() : null;
	}

	feedInput(chars) {
		if(typeof chars === 'string' || chars instanceof String)
			chars = chars.split('');
		if(!chars.length)
			return;
		this.chars = this.chars.concat(chars);
		int i, pushed = false;
		for(i = 0; i < chars.length; ++i) {
			if(this.feedChar(chars[i])) {
				pushed = true;
				break;
			}
		}
		while(pushed)
			pushed = this.feedCharQueue();
	}

	feedCharQueue() {
		var first = true;
		//TODO
	}

	feedChar() {
		//TODO
	}

	beginSequence() {
		//TODO
	}

	advanceSequence() {
		//TODO
	}

	processSingles() {
		//TODO
	}

	endPaths() {
		//TODO
	}

	flushSequences() {
		//TODO
	}

	hasPendingKey() {
		//TODO
	}

}

module.exports = KeyPressToKeyConverter;
