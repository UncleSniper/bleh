'use strict';

const harness = require('./util/harness.js');
const expect = require('chai').expect;
const bleh = require('../bleh.js');
const Vect = bleh.Vect;

Function.mochaDescribe = describe;
Function.mochaIt = it;

function t_Vect() {
	tm_constructor.test();
	tp_row.test();
	tp_column.test();
}

function tm_constructor() {
	it('should set properties correctly', () => {
		const vec = new Vect(42, 1337);
		expect(vec.x).to.equal(42);
		expect(vec.y).to.equal(1337);
	});
}

function tp_row() {
	it('should return the y property', () => expect(new Vect(42, 1337).row).to.equal(1337));
	it('should set the y property', () => {
		const vec = new Vect(1, 2);
		vec.row = 5;
		expect(vec.x).to.equal(1);
		expect(vec.y).to.equal(5);
	});
}

function tp_column() {
	it('should return the x property', () => expect(new Vect(42, 1337).column).to.equal(42));
	it('should set the x property', () => {
		const vec = new Vect(1, 2);
		vec.column = 5;
		expect(vec.x).to.equal(5);
		expect(vec.y).to.equal(2);
	});
}

t_Vect.test();
