'use strict';

class Vect {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	get row() {
		return this.y;
	}

	get column() {
		return this.x;
	}

}

module.exports = Vect;
