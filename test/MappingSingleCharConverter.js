'use strict';

const harness = require('./util/harness.js');
const any = harness.any;
const expect = require('chai').expect;
const bleh = require('../bleh.js');
const MappingSingleCharConverter = bleh.MappingSingleCharConverter;

Function.mochaDescribe = describe;
Function.mochaIt = it;

const anyConv = any.bind(null, MappingSingleCharConverter);

function t_MappingSingleCharConverter() {
	tm_constructor.test();
	tm_putKey.test();
	tm_clearKeys.test();
	tm_registerControlKeys.test();
	tp_CONTROL.test();
	tp_ALTERNATE_BACKSPACE.test();
}

function tm_constructor() {
	const conv = new MappingSingleCharConverter();
	it('should create #keys', () => expect(conv.keys).to.exist);
	it('should start with empty #keys', () => expect(conv.keys).to.be.empty);
	it('should not have #keys inherit', () => expect(conv.keys.__proto__).to.be.undefined);
}

function tm_putKey() {
	const inputChar = Symbol(), key = Symbol(), key2 = Symbol();
	anyConv('should establish new bindings', conv => {
		expect(conv.keys).not.to.have.a.property(inputChar);
		conv.putKey(inputChar, key);
		expect(conv.keys).to.have.a.property(inputChar, key);
	});
	anyConv('should replace existing bindings', conv => {
		conv.keys[inputChar] = key;
		conv.putKey(inputChar, key2);
		expect(conv.keys).to.have.a.property(inputChar, key2);
	});
	anyConv('should return this', conv => {
		expect(conv.putKey(inputChar, key)).to.equal(conv);
	});
	//TODO
}

function tm_clearKeys() {
	//TODO
}

function tm_registerControlKeys() {
	//TODO
}

function tp_CONTROL() {
	//TODO
}

function tp_ALTERNATE_BACKSPACE() {
	//TODO
}

t_MappingSingleCharConverter.test();
