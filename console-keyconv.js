const Terminal = require('./terminal.js');
const Key = Terminal.Key;

class KeyPressToKeyConverter {

	constructor() {
		this.inputConverters = [];
		this.singleByteConverters = [];
		this._stages = this.lastKey = null;
		this._lastLength = 0;
		this._chars = [];
		this._keyQueue = [];
		this._currentDepth = 0;
		this.discardedInputSink = null;
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
		return this._keyQueue.length ? this._keyQueue.shift() : null;
	}

	fetchKeys() {
		var keys = this._keyQueue;
		this._keyQueue = [];
		return keys;
	}

	feedInput(chars) {
		if(typeof chars === 'string' || chars instanceof String)
			chars = chars.split('');
		if(!chars.length)
			return;
		this._chars = this._chars.concat(chars);
		var i, pushed = false;
		for(i = 0; i < chars.length; ++i) {
			if(this._feedChar(chars[i])) {
				pushed = true;
				break;
			}
		}
		while(pushed)
			pushed = this._feedCharQueue();
	}

	_feedCharQueue() {
		var i;
		for(i = 0; i < this._chars.length; ++i) {
			if(this._feedChar(this._chars[i]))
				return true;
		}
		return false;
	}

	_feedChar(input) {
		if(!this._currentDepth)
			this._beginSequences();
		this._advanceSequences(input);
		if(!this._currentDepth)
			this._processSingles(input);
		++this._currentDepth;
		if(!this._stages.length) {
			this._endPaths(input);
			return true;
		}
		else
			return false;
	}

	_beginSequences() {
		this._stages = [];
		var i, stage, key;
		for(i = 0; i < this.inputConverters.length; ++i) {
			stage = this.inputConverters[i].newSequence();
			if(!stage)
				continue;
			key = stage.currentKey;
			if(!this.lastKey && key) {
				this.lastKey = key;
				this._lastLength = 0;
			}
			if(!stage.inputLeaf)
				this._stages.push(stage);
		}
	}

	_advanceSequences(input) {
		var nextKey = null, i, nextStage, key;
		for(i = 0; i < this._stages.length; ++i) {
			nextStage = this._stages[i].getNextStage(input);
			if(!nextStage) {
				this._stages.splice(i, 1);
				--i;
				continue;
			}
			key = nextStage.currentKey;
			if(!nextKey && key)
				nextKey = key;
			if(nextStage.inputLeaf) {
				this._stages.splice(i, 1);
				--i;
			}
			else
				this._stages[i] = nextStage;
		}
		if(nextKey) {
			this.lastKey = nextKey;
			this._lastLength = this._currentDepth;
		}
	}

	_processSingles(input) {
		var i, key;
		for(i = 0; i < this.singleByteConverters.length; ++i) {
			key = this.singleByteConverters[i].charToKey(input);
			if(!this.lastKey && key) {
				this.lastKey = key;
				this._lastLength = 1;
			}
		}
	}

	_endPaths(input) {
		if(!this.lastKey) {
			this.lastKey = new Key(Key.GENERIC, 0, input);
			this._lastLength = 1;
		}
		this._flushLastKeyAndClean();
	}

	_flushLastKeyAndClean() {
		this._keyQueue.push(this.lastKey);
		this._stages = this.lastKey = null;
		var killed = null;
		if(this._lastLength) {
			if(this._lastLength >= this._chars.length) {
				killed = this._chars;
				this._chars = [];
			}
			else
				killed = this._chars.splice(0, this._lastLength);
			this._lastLength = 0;
		}
		this._currentDepth = 0;
		if(killed && killed.length && this.discardedInputSink)
			this.discardedInputSink(killed.join(''));
	}

	flushSequences() {
		if(this.lastKey)
			this._flushLastKeyAndClean();
	}

	hasPendingKey() {
		return !!this.lastKey;
	}

}

module.exports = KeyPressToKeyConverter;
