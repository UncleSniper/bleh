const Terminal = require('./Terminal.js');
const Key = Terminal.Key;
const SequenceMap = require('./SequenceMap.js');
const KeyPressToKeyConverter = require('./KeyPressToKeyConverter.js');
const SequenceMapInputConverter = require('./SequenceMapInputConverter.js');
const MappingSingleCharConverter = require('./MappingSingleCharConverter.js');

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

const keyconvs = Object.create(null);

Object.assign(keyconvs, {

	'xterm': function() {
		const conv = new KeyPressToKeyConverter();
		const smic = new SequenceMapInputConverter();
		xtermSeqMap(smic.map);
		conv.addInputConverter(smic);
		conv.addSingleByteConverter(MappingSingleCharConverter.ALTERNATE_BACKSPACE);
		const mscc = new MappingSingleCharConverter();
		xtermSingles(mscc);
		conv.addSingleByteConverter(mscc);
		return conv;
	}

});

const db = Object.create(null);

Object.assign(db, {

	'xterm': {
		keyConverter: keyconvs.xterm
	}

});

alias('xterm', 'xterm-256color');

function xtermSeqMap(map) {
	mapseq(map)
		// S-F?
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
		// C-F?
		.map('\u001b[1;5P', Key.FUNCTION, Key.CTRL, 1)
		.map('\u001b[1;5Q', Key.FUNCTION, Key.CTRL, 2)
		.map('\u001b[1;5R', Key.FUNCTION, Key.CTRL, 3)
		.map('\u001b[1;5S', Key.FUNCTION, Key.CTRL, 4)
		.map('\u001b[15;5~', Key.FUNCTION, Key.CTRL, 5)
		.map('\u001b[17;5~', Key.FUNCTION, Key.CTRL, 6)
		.map('\u001b[18;5~', Key.FUNCTION, Key.CTRL, 7)
		.map('\u001b[19;5~', Key.FUNCTION, Key.CTRL, 8)
		.map('\u001b[20;5~', Key.FUNCTION, Key.CTRL, 9)
		.map('\u001b[21;5~', Key.FUNCTION, Key.CTRL, 10)
		.map('\u001b[23;5~', Key.FUNCTION, Key.CTRL, 11)
		.map('\u001b[24;5~', Key.FUNCTION, Key.CTRL, 12)
		// M-F?
		.map('\u001b[1;3P', Key.FUNCTION, Key.ALT, 1)
		.map('\u001b[1;3Q', Key.FUNCTION, Key.ALT, 2)
		.map('\u001b[1;3R', Key.FUNCTION, Key.ALT, 3)
		.map('\u001b[1;3S', Key.FUNCTION, Key.ALT, 4)
		.map('\u001b[15;3~', Key.FUNCTION, Key.ALT, 5)
		.map('\u001b[17;3~', Key.FUNCTION, Key.ALT, 6)
		.map('\u001b[18;3~', Key.FUNCTION, Key.ALT, 7)
		.map('\u001b[19;3~', Key.FUNCTION, Key.ALT, 8)
		.map('\u001b[20;3~', Key.FUNCTION, Key.ALT, 9)
		.map('\u001b[21;3~', Key.FUNCTION, Key.ALT, 10)
		.map('\u001b[23;3~', Key.FUNCTION, Key.ALT, 11)
		.map('\u001b[24;3~', Key.FUNCTION, Key.ALT, 12)
		// C-M-F?
		.map('\u001b[1;7P', Key.FUNCTION, Key.CTRL | Key.ALT, 1)
		.map('\u001b[1;7Q', Key.FUNCTION, Key.CTRL | Key.ALT, 2)
		.map('\u001b[1;7R', Key.FUNCTION, Key.CTRL | Key.ALT, 3)
		.map('\u001b[1;7S', Key.FUNCTION, Key.CTRL | Key.ALT, 4)
		.map('\u001b[15;7~', Key.FUNCTION, Key.CTRL | Key.ALT, 5)
		.map('\u001b[17;7~', Key.FUNCTION, Key.CTRL | Key.ALT, 6)
		.map('\u001b[18;7~', Key.FUNCTION, Key.CTRL | Key.ALT, 7)
		.map('\u001b[19;7~', Key.FUNCTION, Key.CTRL | Key.ALT, 8)
		.map('\u001b[20;7~', Key.FUNCTION, Key.CTRL | Key.ALT, 9)
		.map('\u001b[21;7~', Key.FUNCTION, Key.CTRL | Key.ALT, 10)
		.map('\u001b[23;7~', Key.FUNCTION, Key.CTRL | Key.ALT, 11)
		.map('\u001b[24;7~', Key.FUNCTION, Key.CTRL | Key.ALT, 12)
		// C-S-F?
		.map('\u001b[1;6P', Key.FUNCTION, Key.CTRL | Key.SHIFT, 1)
		.map('\u001b[1;6Q', Key.FUNCTION, Key.CTRL | Key.SHIFT, 2)
		.map('\u001b[1;6R', Key.FUNCTION, Key.CTRL | Key.SHIFT, 3)
		.map('\u001b[1;6S', Key.FUNCTION, Key.CTRL | Key.SHIFT, 4)
		.map('\u001b[15;6~', Key.FUNCTION, Key.CTRL | Key.SHIFT, 5)
		.map('\u001b[17;6~', Key.FUNCTION, Key.CTRL | Key.SHIFT, 6)
		.map('\u001b[18;6~', Key.FUNCTION, Key.CTRL | Key.SHIFT, 7)
		.map('\u001b[19;6~', Key.FUNCTION, Key.CTRL | Key.SHIFT, 8)
		.map('\u001b[20;6~', Key.FUNCTION, Key.CTRL | Key.SHIFT, 9)
		.map('\u001b[21;6~', Key.FUNCTION, Key.CTRL | Key.SHIFT, 10)
		.map('\u001b[23;6~', Key.FUNCTION, Key.CTRL | Key.SHIFT, 11)
		.map('\u001b[24;6~', Key.FUNCTION, Key.CTRL | Key.SHIFT, 12)
		// S-M-F?
		.map('\u001b[1;4P', Key.FUNCTION, Key.ALT | Key.SHIFT, 1)
		.map('\u001b[1;4Q', Key.FUNCTION, Key.ALT | Key.SHIFT, 2)
		.map('\u001b[1;4R', Key.FUNCTION, Key.ALT | Key.SHIFT, 3)
		.map('\u001b[1;4S', Key.FUNCTION, Key.ALT | Key.SHIFT, 4)
		.map('\u001b[15;4~', Key.FUNCTION, Key.ALT | Key.SHIFT, 5)
		.map('\u001b[17;4~', Key.FUNCTION, Key.ALT | Key.SHIFT, 6)
		.map('\u001b[18;4~', Key.FUNCTION, Key.ALT | Key.SHIFT, 7)
		.map('\u001b[19;4~', Key.FUNCTION, Key.ALT | Key.SHIFT, 8)
		.map('\u001b[20;4~', Key.FUNCTION, Key.ALT | Key.SHIFT, 9)
		.map('\u001b[21;4~', Key.FUNCTION, Key.ALT | Key.SHIFT, 10)
		.map('\u001b[23;4~', Key.FUNCTION, Key.ALT | Key.SHIFT, 11)
		.map('\u001b[24;4~', Key.FUNCTION, Key.ALT | Key.SHIFT, 12)
		// C-S-M-F?
		.map('\u001b[1;8P', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 1)
		.map('\u001b[1;8Q', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 2)
		.map('\u001b[1;8R', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 3)
		.map('\u001b[1;8S', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 4)
		.map('\u001b[15;8~', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 5)
		.map('\u001b[17;8~', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 6)
		.map('\u001b[18;8~', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 7)
		.map('\u001b[19;8~', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 8)
		.map('\u001b[20;8~', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 9)
		.map('\u001b[21;8~', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 10)
		.map('\u001b[23;8~', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 11)
		.map('\u001b[24;8~', Key.FUNCTION, Key.CTRL | Key.ALT | Key.SHIFT, 12)
		// misc
		.map('\u001b[1;5l', Key.GENERIC, Key.CTRL, ',')
		.map('\u001b[1;6l', Key.GENERIC, Key.CTRL | Key.SHIFT, ',')
		.map('\u001b[1;7l', Key.GENERIC, Key.CTRL | Key.ALT, ',')
		.map('\u001b[1;8l', Key.GENERIC, Key.CTRL | Key.ALT | Key.SHIFT, ',')
		.map('\u001b[1;5n', Key.GENERIC, Key.CTRL, '.')
		.map('\u001b[1;6n', Key.GENERIC, Key.CTRL | Key.SHIFT, '.')
		.map('\u001b[1;7n', Key.GENERIC, Key.CTRL | Key.ALT, '.')
		.map('\u001b[1;8n', Key.GENERIC, Key.CTRL | Key.ALT | Key.SHIFT, '.')
		.map('\u001b[Z', Key.GENERIC, Key.SHIFT, '\t')
		.map('\u001b[1;5I', Key.GENERIC, Key.CTRL, '\t')
		.map('\u001b[1;6I', Key.GENERIC, Key.SHIFT | Key.CTRL, '\t')
	;
}

function xtermSingles(mapper) {
	mapsing(mapper)
		.map('\u001e', Key.ENTER, Key.CTRL, '\n')
		.map('\u001c', Key.GENERIC, Key.CTRL, '\\')
		.map('\u001d', Key.GENERIC, Key.CTRL, ']')
		.map('\u001f', Key.GENERIC, Key.CTRL, '/')
	;
}

function alias(oldName, newName, warningChannel) {
	const spec = db[oldName];
	if(spec)
		db[newName] = spec;
	else
		(warningChannel ? warningChannel : process.stderr.write.bind(process.stderr))("bleh: "
				+ "Ignoring terminal type alias '" + oldName + "' -> '" + newName
				+ "', since the former is undefined.\n");
}

module.exports = {
	db,
	keyconvs,
	mapseq,
	mapsing,
	xtermSeqMap,
	xtermSingles,
	alias
};
