'use strict';

const Terminal = require('./Terminal.js');
const Key = Terminal.Key;
const SingleCharConverter = require('./SingleCharConverter.js');

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
				this.keys[String.fromCharCode(code & 0x1F)] = new Key(Key.GENERIC, Key.CTRL, c);
		}
		return this;
	}

	charToKey(inputChar) {
		return this.keys[inputChar] || null;
	}

}

MappingSingleCharConverter.CONTROL = new MappingSingleCharConverter().registerControlKeys();
MappingSingleCharConverter.ALTERNATE_BACKSPACE = new MappingSingleCharConverter()
		.putKey('\u007F', new Key(Key.GENERIC, 0, '\b'));

module.exports = MappingSingleCharConverter;
