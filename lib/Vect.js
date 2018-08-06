'use strict';

class Vect {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	get row() {
		return this.y;
	}

	set row(row) {
		return this.y = row;
	}

	get column() {
		return this.x;
	}

	set column(column) {
		return this.x = column;
	}

}

module.exports = Vect;
