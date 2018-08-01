'use strict';

const harness = require('./util/harness.js');
const any = harness.any;
const expect = require('chai').expect;
const bleh = require('../bleh.js');
const Rect = bleh.Rect;

Function.mochaDescribe = describe;
Function.mochaIt = it;

const anyRect = any.bind(null, Rect.bind(null, 1, 2, 3, 4));

function theRect(x, y, width, height, description, callback) {
	it(description, () => callback(new Rect(x, y, width, height)));
}

function rectIs(rect, x, y, width, height) {
	expect(rect.x).to.equal(x);
	expect(rect.y).to.equal(y);
	expect(rect._width).to.equal(width);
	expect(rect._height).to.equal(height);
}

function t_Rect() {
	tm_constructor.test();
	tp_width.test();
	tp_height.test();
	tp_row.test();
	tp_column.test();
	tp_x1.test();
	tp_x2.test();
	tp_y1.test();
	tp_y2.test();
	tm_constrainInto.test();
	tm_intersect.test();
	tm_containsCell.test();
}

function tm_constructor() {
	theRect(2, 3, 5, 7, 'should set properties correctly for non-negative width and height', rect => {
		expect(rect.x).to.equal(2);
		expect(rect.y).to.equal(3);
		expect(rect._width).to.equal(5);
		expect(rect._height).to.equal(7);
	});
	theRect(2, 3, 5, -7, 'should set properties correctly for non-negative width and negative height', rect => {
		expect(rect.x).to.equal(2);
		expect(rect.y).to.equal(-4);
		expect(rect._width).to.equal(5);
		expect(rect._height).to.equal(7);
	});
	theRect(2, 3, -5, 7, 'should set properties correctly for negative width and non-negative height', rect => {
		expect(rect.x).to.equal(-3);
		expect(rect.y).to.equal(3);
		expect(rect._width).to.equal(5);
		expect(rect._height).to.equal(7);
	});
	theRect(2, 3, -5, -7, 'should set properties correctly for negative width and height', rect => {
		expect(rect.x).to.equal(-3);
		expect(rect.y).to.equal(-4);
		expect(rect._width).to.equal(5);
		expect(rect._height).to.equal(7);
	});
}

function tp_width() {
	anyRect('should return the _width property', rect => expect(rect.width).to.equal(3));
	anyRect('should set the _width property when non-negative', rect => {
		rect.width = 5;
		rectIs(rect, 1, 2, 5, 4);
	});
	anyRect('should adjust x and _width when negative', rect => {
		rect.width = -5;
		rectIs(rect, -4, 2, 5, 4);
	});
}

function tp_height() {
	anyRect('should return the _height property', rect => expect(rect.height).to.equal(4));
	anyRect('should set the _height property when non-negative', rect => {
		rect.height = 5;
		rectIs(rect, 1, 2, 3, 5);
	});
	anyRect('should adjust y and _height when negative', rect => {
		rect.height = -5;
		rectIs(rect, 1, -3, 3, 5);
	});
}

function tp_row() {
	anyRect('should return the y property', rect => expect(rect.row).to.equal(2));
	anyRect('should set the y property', rect => {
		rect.row = 5;
		rectIs(rect, 1, 5, 3, 4);
	});
}

function tp_column() {
	anyRect('should return the x property', rect => expect(rect.column).to.equal(1));
	anyRect('should set the x property', rect => {
		rect.column = 5;
		rectIs(rect, 5, 2, 3, 4);
	});
}

function tp_x1() {
	anyRect('should return the x property', rect => expect(rect.x1).to.equal(1));
	anyRect('should set the x property', rect => {
		rect.x1 = 5;
		rectIs(rect, 5, 2, 3, 4);
	});
}

function tp_x2() {
	anyRect('should return right bound', rect => expect(rect.x2).to.equal(4));
	anyRect('should adjust _width if right of x', rect => {
		rect.x2 = 5;
		rectIs(rect, 1, 2, 4, 4);
		rect.x2 = 1;
		rectIs(rect, 1, 2, 0, 4);
	});
	anyRect('should adjust x and _width if left of x', rect => {
		rect.x2 = 0;
		rectIs(rect, 0, 2, 1, 4);
	});
}

function tp_y1() {
	anyRect('should return the y property', rect => expect(rect.y1).to.equal(2));
	anyRect('should set the y property', rect => {
		rect.y1 = 5;
		rectIs(rect, 1, 5, 3, 4);
	});
}

function tp_y2() {
	anyRect('should return bottom bound', rect => expect(rect.y2).to.equal(6));
	anyRect('should adjust _height if below y', rect => {
		rect.y2 = 5;
		rectIs(rect, 1, 2, 3, 3);
		rect.y2 = 2;
		rectIs(rect, 1, 2, 3, 0);
	});
	anyRect('should adjust y and _height if above y', rect => {
		rect.y2 = 0;
		rectIs(rect, 1, 0, 3, 2);
	});
}

function tm_constrainInto() {
	theRect(-3, 7, 6, 2, 'should constrain the left bound if necessary', rect => {
		rect.constrainInto(10, 20);
		rectIs(rect, 0, 7, 3, 2);
	});
	//TODO
}

function tm_intersect() {
	//TODO
}

function tm_containsCell() {
	//TODO
}

t_Rect.test();
