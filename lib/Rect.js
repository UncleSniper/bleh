'use strict';

class Rect {

	constructor(x, y, width, height) {
		if(width < 0) {
			this.x = x + width;
			this._width = -width;
		}
		else {
			this.x = x;
			this._width = width;
		}
		if(height < 0) {
			this.y = y + height;
			this._height = -height;
		}
		else {
			this.y = y;
			this._height = height;
		}
	}

	get width() {
		return this._width;
	}

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
