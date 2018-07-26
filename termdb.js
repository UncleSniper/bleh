const Terminal = require('./terminal.js');
const Key = Terminal.Key;
const SequenceMap = require('./seqmap.js');
const KeyPressToKeyConverter = require('./console-keyconv.js');
const inputconv = require('./inputconv.js');

function mapseq(rawMap) {
	return Object.create(rawMap, {
		map: {
			value: function(keyStr, type, modifiers, value) {
				this.put(keyStr.split(''), new Key(type, modifiers, value));
				return this;
			}
		}
	});
}

function mapsing(rawMapper) {
	return Object.create(rawMapper, {
		map: {
			value: function(keyStr, type, modifiers, value) {
				this.putKey(keyStr, new Key(type, modifiers, value));
				return this;
			}
		}
	});
}

const db = Object.create(null);

Object.assign(db, {

	'xterm': {
		keyConverter: function() {
			const conv = new KeyPressToKeyConverter();
			const smic = new inputconv.SequenceMapInputConverter();
			xtermSeqMap(smic.map);
			conv.addInputConverter(smic);
			conv.addSingleByteConverter(inputconv.MappingSingleCharConverter.ALTERNATE_BACKSPACE);
			const mscc = new inputconv.MappingSingleCharConverter();
			xtermSingles(mscc);
			conv.addSingleByteConverter(mscc);
			return conv;
		}
	}

});

function xtermSeqMap(map) {
	mapseq(map)
		.map('\u001b[1;2P', Key.FUNCTION, Key.SHIFT, 1)
		.map('\u001b[1;2Q', Key.FUNCTION, Key.SHIFT, 2)
		.map('\u001b[1;2R', Key.FUNCTION, Key.SHIFT, 3)
		.map('\u001b[1;2S', Key.FUNCTION, Key.SHIFT, 4)
		.map('\u001b[15;2~', Key.FUNCTION, Key.SHIFT, 5)
		.map('\u001b[17;2~', Key.FUNCTION, Key.SHIFT, 6)
		.map('\u001b[18;2~', Key.FUNCTION, Key.SHIFT, 7)
		.map('\u001b[19;2~', Key.FUNCTION, Key.SHIFT, 8)
		.map('\u001b[20;2~', Key.FUNCTION, Key.SHIFT, 9)
		.map('\u001b[21;2~', Key.FUNCTION, Key.SHIFT, 10)
		.map('\u001b[23;2~', Key.FUNCTION, Key.SHIFT, 11)
		.map('\u001b[24;2~', Key.FUNCTION, Key.SHIFT, 12)
	;
}

function xtermSingles(mapper) {
	mapsing(mapper)
		.map('\u001e', Key.ENTER, Key.CTRL, '\n')
	;
}

module.exports = db;
