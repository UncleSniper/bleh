'use strict';

const Terminal = require('./Terminal.js');
const Key = Terminal.Key;

class KeyPressToKeyConverter {

	constructor() {
		this.inputConverters = [];
		this.singleByteConverters = [];
		this._stages = this._lastKey = null;
		this._lastLength = 0;
		this._chars = [];
		this._keyQueue = [];
		this._currentDepth = 0;
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
		while(this._currentDepth < this._chars.length)
			this._feedChar(this._chars[this._currentDepth]);
	}

	_feedChar(input) {
		if(!this._currentDepth)
			this._beginSequences();
		++this._currentDepth;
		this._advanceSequences(input);
		if(this._currentDepth == 1)
			this._processSingles(input);
		if(!this._stages.length)
			this._endPaths();
	}

	_beginSequences() {
		this._stages = [];
		var i, stage, key;
		for(i = 0; i < this.inputConverters.length; ++i) {
			stage = this.inputConverters[i].newSequence();
			if(!stage)
				continue;
			key = stage.currentKey;
			if(!this._lastKey && key) {
				this._lastKey = key;
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
			this._lastKey = nextKey;
			this._lastLength = this._currentDepth;
		}
	}

	_processSingles(input) {
		var i, key;
		for(i = 0; i < this.singleByteConverters.length; ++i) {
			key = this.singleByteConverters[i].charToKey(input);
			if(!this._lastKey && key) {
				this._lastKey = key;
				this._lastLength = 1;
			}
		}
	}

	_endPaths() {
		if(!this._lastKey) {
			this._lastKey = new Key(Key.GENERIC, 0, this._chars[0]);
			this._lastLength = 1;
		}
		this._flushLastKeyAndClean();
	}

	_flushLastKeyAndClean() {
		this._keyQueue.push(this._lastKey);
		this._stages = this._lastKey = null;
		if(this._lastLength) {
			if(this._lastLength >= this._chars.length)
				this._chars = [];
			else
				this._chars.splice(0, this._lastLength);
			this._lastLength = 0;
		}
		this._currentDepth = 0;
	}

	flushSequences() {
		if(this._lastKey)
			this._flushLastKeyAndClean();
	}

	hasPendingKey() {
		return !!this._lastKey;
	}

}

module.exports = KeyPressToKeyConverter;
