const EventEmitter = require('events');

class Terminal extends EventEmitter {

	constructor() {
		super();
	}

	start() {}

	stop() {}

}

const boxChars = {
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

module.exports = {
	Terminal,
	boxChars
};
