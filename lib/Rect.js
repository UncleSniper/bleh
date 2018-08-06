'use strict';

/** @module bleh */

/**
 * 2D rectangle. Used to indicate rectangular
 * regions, notably on the terminal screen.
 * The fundamental denotation is an origin
 * (corner) and a size (width and height),
 * designated in a left-handed coordinate
 * system (as arising from the "columns and
 * rows" notion of the terminal).
 * Generally, the left and upper bounds
 * (i.e. the origin) are deemed inclusive,
 * whereas the right and lower bounds are
 * deemed exclusive.
 *
 * @property {int} x
 * the x (column) coordinate of the origin
 * @property {int} y
 * the y (row) coordinate of the origin
 * @property {int} width
 * the width of the rectangle (non-negative)
 * @property {int} height
 * the height of the rectangle (non-negative)
 * @memberOf module:bleh
 */
class Rect {

	/**
	 * Initialize rectangle with given origin and size.
	 * The <code>(x, y)</code> coordinates normally indicate
	 * the left (i.e. low x) upper (i.e. low y) corner,
	 * but this notion is based on the premise that the
	 * size (width and height) cannot be negative. Thus,
	 * if a negative width and/or height is given, the
	 * corresponding bounds are swapped, causing the given
	 * origin coordinate to indicate the right/lower
	 * bound instead (and allowing the size to once again
	 * be made non-negative).
	 * @param {int} x
	 * the x (column) coordinate of the origin
	 * @param {int} y
	 * the y (row) coordinate of the origin
	 * @param {int} width
	 * the width of the rectangle
	 * @param {int} height
	 * the height of the rectangle
	 */
	constructor(x, y, width, height) {
		if(width < 0) {
			/**
			 * The x (column) coordinate of the origin,
			 * indicating the left bound of the rectangle.
			 * Zero indicates the leftmost column.
			 */
			this.x = x + width;
			this._width = -width;
		}
		else {
			this.x = x;
			this._width = width;
		}
		if(height < 0) {
			/**
			 * The y (row) coordinate of the origin,
			 * indicating the top bound of the rectangle.
			 * Zero indicates the topmost row.
			 */
			this.y = y + height;
			this._height = -height;
		}
		else {
			this.y = y;
			this._height = height;
		}
	}

	/**
	 * The width of the rectangle. The rectangle
	 * thus extends from <code>this.x</code>
	 * (inclusively) to <code>this.x + this.width</code>
	 * (exclusively). In order to ensure consistency,
	 * this property is kept non-negative. Assigning
	 * a negative number will thus assign the absolute
	 * width and move the <code>x</code> coordinate
	 * left by that same absolute width.
	 */
	get width() {
		return this._width;
	}

	/**
	 * The height of the rectangle. The rectangle
	 * thus extends from <code>this.y</code>
	 * (inclusively) to <code>this.y + this.height</code>
	 * (exclusively). In order to ensure consistency,
	 * this property is kept non-negative. Assigning
	 * a negative number will thus assign the absolute
	 * height and move the <code>y</code> coordinate
	 * up by that same absolute height.
	 */
	get height() {
		return this._height;
	}

	set width(newWidth) {
		if(newWidth < 0) {
			this.x += newWidth;
			this._width = -newWidth;
		}
		else
			this._width = newWidth;
		return newWidth;
	}

	set height(newHeight) {
		if(newHeight < 0) {
			this.y += newHeight;
			this._height = -newHeight;
		}
		else
			this._height = newHeight;
		return newHeight;
	}

	/**
	 * Alias for {@link bleh.Rect#y y}.
	 */
	get row() {
		return this.y;
	}

	set row(row) {
		return this.y = row;
	}

	/**
	 * Alias for {@link bleh.Rect#x x}.
	 */
	get column() {
		return this.x;
	}

	set column(column) {
		return this.x = column;
	}

	get x1() {
		return this.x;
	}

	set x1(x) {
		return this.x = x;
	}

	get x2() {
		return this.x + this._width;
	}

	set x2(x2) {
		var right;
		if(x2 >= this.x)
			this._width = x2 - this.x;
		else {
			this._width = this.x - x2;
			this.x = x2;
		}
		return x2;
	}

	get y1() {
		return this.y;
	}

	set y1(y) {
		return this.y = y;
	}

	get y2() {
		return this.y + this._height;
	}

	set y2(y2) {
		var bottom;
		if(y2 >= this.y)
			this._height = y2 - this.y;
		else {
			this._height = this.y - y2;
			this.y = y2;
		}
		return y2;
	}

	constrainInto(containerWidth, containerHeight) {
		if(containerWidth < 0)
			containerWidth = 0;
		if(containerHeight < 0)
			containerHeight = 0;
		var right = this.x + this._width;
		if(right < 0)
			right = 0;
		if(right > containerWidth)
			right = containerWidth;
		var bottom = this.y + this._height;
		if(bottom < 0)
			bottom = 0;
		if(bottom > containerHeight)
			bottom = containerHeight;
		if(this.x >= containerWidth)
			this.x = containerWidth - 1;
		if(this.x < 0)
			this.x = 0;
		if(this.y >= containerHeight)
			this.y = containerHeight - 1;
		if(this.y < 0)
			this.y = 0;
		this._width = right <= this.x ? 0 : right - this.x;
		this._height = bottom <= this.y ? 0 : bottom - this.y;
	}

	intersect(rect) {
		const x1 = this.x > rect.x ? this.x : rect.x;
		const y1 = this.y > rect.y ? this.y : rect.y;
		const right1 = this.x2, right2 = rect.x2;
		var x2 = right1 < right2 ? right1 : right2;
		const bottom1 = this.y2, bottom2 = rect.y2;
		var y2 = bottom1 < bottom2 ? bottom1 : bottom2;
		if(x2 < x1)
			x2 = x1;
		if(y2 < y1)
			y2 = y1;
		return new Rect(x1, y1, x2 - x1, y2 - y1);
	}

	containsCell(cellColumn, cellRow) {
		return cellRow >= this.y && cellRow < this.y2 && cellColumn >= this.x && cellColumn <= this.x2;
	}

}

module.exports = Rect;
