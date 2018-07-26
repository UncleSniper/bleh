const EventEmitter = require('events');

class Terminal extends EventEmitter {

	constructor() {
		super();
	}

	start() {}

	stop() {}

	pushRawKeyInterceptor(interceptor) {}

	popRawKeyInterceptor() {}

	removeRawKeyInterceptor(interceptor) {}

}

Terminal.unicodeBoxChars = {
	vert: '\u2502',
	hor: '\u2500',
	leftUpper: '\u250C',
	rightUpper: '\u2510',
	leftLower: '\u2514',
	rightLower: '\u2518',
	rightT: '\u251C',
	leftT: '\u2524',
	downT: '\u252C',
	upT: '\u2534',
	cross: '\u253C',
	doubleHor: '\u2550',
	doubleVert: '\u2551',
	leftDoubleUpper: '\u2552',
	doubleLeftUpper: '\u2553',
	doubleLeftDoubleUpper: '\u2554',
	rightDoubleUpper: '\u2555',
	doubleRightUpper: '\u2556',
	doubleRightDoubleUpper: '\u2557',
	leftDoubleLower: '\u2558',
	doubleLeftLower: '\u2559',
	doubleLeftDoubleLower: '\u255A',
	rightDoubleLower: '\u255B',
	doubleRightLower: '\u255C',
	doubleRightDoubleLower: '\u255D',
	doubleRightT: '\u255E',
	rightDoubleT: '\u255F',
	doubleRightDoubleT: '\u2560',
	doubleLeftT: '\u2561',
	leftDoubleT: '\u2562',
	doubleLeftDoubleT: '\u2563',
	downDoubleT: '\u2564',
	doubleDownT: '\u2565',
	doubleDownDoubleT: '\u2566',
	upDoubleT: '\u2567',
	doubleUpT: '\u2568',
	doubleUpDoubleT: '\u2569',
	doubleHorCross: '\u256A',
	doubleVertCross: '\u256B',
	doubleCross: '\u256C'
};

Terminal.asciiBoxChars = {
	vert: '|',
	hor: '-',
	leftUpper: '+',
	rightUpper: '+',
	leftLower: '+',
	rightLower: '+',
	rightT: '+',
	leftT: '+',
	downT: '+',
	upT: '+',
	cross: '+',
	doubleHor: '|',
	doubleVert: '-',
	leftDoubleUpper: '+',
	doubleLeftUpper: '+',
	doubleLeftDoubleUpper: '+',
	rightDoubleUpper: '+',
	doubleRightUpper: '+',
	doubleRightDoubleUpper: '+',
	leftDoubleLower: '+',
	doubleLeftLower: '+',
	doubleLeftDoubleLower: '+',
	rightDoubleLower: '+',
	doubleRightLower: '+',
	doubleRightDoubleLower: '+',
	doubleRightT: '+',
	rightDoubleT: '+',
	doubleRightDoubleT: '+',
	doubleLeftT: '+',
	leftDoubleT: '+',
	doubleLeftDoubleT: '+',
	downDoubleT: '+',
	doubleDownT: '+',
	doubleDownDoubleT: '+',
	upDoubleT: '+',
	doubleUpT: '+',
	doubleUpDoubleT: '+',
	doubleHorCross: '+',
	doubleVertCross: '+',
	doubleCross: '+'
};

class Key {

	constructor(type, modifiers, value) {
		this.type = type;
		this.modifiers = modifiers;
		this.value = value;
	}

	toString() {
		const prefix = Key.modifierPrefix(this.modifiers);
		switch(this.type) {
			case Key.FUNCTION:
				return prefix + 'F' + this.value;
			case Key.GENERIC:
				return prefix + Key.nameChar(this.value);
			default:
				return prefix + Key.TYPE_NAMES[this.type];
		}
	}

	static modifierPrefix(modifiers) {
		var prefix = '';
		if(modifiers & Key.CTRL)
			prefix += 'C-';
		if(modifiers & Key.SHIFT)
			prefix += 'S-';
		if(modifiers & Key.ALT)
			prefix += 'M-';
		return prefix;
	}

	static nameChar(c) {
		switch(c) {
			case '\u0000':
				return 'Null';
			case '\u0007':
				return 'Bell';
			case '\b':
				return 'Backspace';
			case '\t':
				return 'Tab';
			case '\n':
				return 'Newline';
			case '\f':
				return 'FormFeed';
			case '\r':
				return 'Return';
			case '\u001b':
				return 'Escape';
			case ' ':
				return 'Space';
			default:
				return c;
		}
	}

}

Key.CTRL = 1;
Key.ALT = 2;
Key.SHIFT = 4;

Key.DELETE = 0;
Key.DOWN = 1;
Key.END = 2;
Key.ENTER = 3;
Key.FUNCTION = 4;
Key.HOME = 5;
Key.INSERT = 6;
Key.LEFT = 7;
Key.PAGE_DOWN = 8;
Key.PAGE_UP = 9;
Key.RIGHT = 10;
Key.UP = 11;
Key.GENERIC = 12;

Key.TYPE_NAMES = [
	'Delete',
	'Down',
	'End',
	'Enter',
	null,
	'Home',
	'Insert',
	'Left',
	'PageDown',
	'PageUp',
	'Right',
	'Up',
	null
];

Terminal.Key = Key;

module.exports = Terminal;
