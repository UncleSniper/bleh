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

	get column() {
		return this.x;
	}

	get x1() {
		return this.x;
	}

	get x2() {
		return this.x + this._width;
	}

	get y1() {
		return this.y;
	}

	get y2() {
		return this.y + this._height;
	}

	constrainInto(containerWidth, containerHeight) {
		if(containerWidth < 0)
			containerWidth = 0;
		if(containerHeight < 0)
			containerHeight = 0;
		if(this.y >= containerHeight)
			this.y = containerHeight - 1;
		if(this.y < 0)
			this.y = 0;
		if(this.x >= containerWidth)
			this.x = containerWidth - 1;
		if(this.y < 0)
			this.y = 0;
		var wbound = containerWidth - this.x;
		if(wbound < 0)
			wbound = 0;
		var hbound = containerHeight - this.y;
		if(hbound < 0)
			hbound = 0;
		if(this._width > wbound)
			this._width = wbound;
		if(this._height > hbound)
			this._height = hbound;
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
