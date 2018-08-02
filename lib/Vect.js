'use strict';

/** @module bleh */

/**
 * 2D vector. Used to indicate points, most
 * notably terminal row + column locations.
 *
 * @property {int} x
 * the x (column) coordinate
 * @property {int} y
 * the y (row) coordinate
 * @memberOf module:bleh
 */
class Vect {

	/**
	 * Initialize vector with given coordinates.
	 * @param {int} x
	 * the x (column) coordinate
	 * @param {int} y
	 * the y (row) coordinate
	 */
	constructor(x, y) {
		/**
		 * The x (column) coordinate. Zero
		 * indicates the leftmost column.
		 */
		this.x = x;
		/**
		 * The y (row) coordinate. Zero
		 * indicates the topmost row.
		 */
		this.y = y;
	}

	/**
	 * Alias for {@link bleh.Vect#y y}.
	 */
	get row() {
		return this.y;
	}

	set row(row) {
		return this.y = row;
	}

	/**
	 * Alias for {@link bleh.Vect#x x}.
	 */
	get column() {
		return this.x;
	}

	set column(column) {
		return this.x = column;
	}

}

module.exports = Vect;
