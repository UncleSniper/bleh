'use strict';

const harness = require('./util/harness.js');
const any = harness.any;
const expect = require('chai').expect;
const bleh = require('../bleh.js');
const MappingSingleCharConverter = bleh.MappingSingleCharConverter;
const Key = bleh.Terminal.Key;

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
	anyConv('should not establish excess bindings', conv => {
		conv.putKey(inputChar, key);
		expect(Object.keys(conv.keys).length + Object.getOwnPropertySymbols(conv.keys).length).to.equal(1);
	});
}

function tm_clearKeys() {
	const inputChar = Symbol(), key = Symbol();
	anyConv('should remove all bindings', conv => {
		conv.keys[inputChar] = key;
		conv.keys['foo'] = 'bar';
		expect(conv.keys).not.to.be.empty;
		conv.clearKeys();
		expect(conv.keys).to.be.empty;
	});
}

function makeControlKeyTest(code) {
	const c = String.fromCharCode(code);
	const ccode = code & 0x1F;
	const key = new Key(Key.GENERIC, Key.CTRL, c);
	anyConv('should set correct binding for ^' + c.toUpperCase(), conv => {
		conv.registerControlKeys();
		expect(conv.keys[String.fromCharCode(ccode)]).to.deep.equal(key);
	});
}

function tm_registerControlKeys() {
	anyConv('should establish exactly 25 bindings', conv => {
		conv.registerControlKeys();
		expect(Object.keys(conv.keys)).to.have.lengthOf(25);
	});
	var i;
	for(i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); ++i) {
		if(i != 'm'.charCodeAt(0))
			makeControlKeyTest(i);
	}
}

function tp_CONTROL() {
	anyConv('should equate result of calling registerControlKeys() on empty map', conv => {
		conv.registerControlKeys();
		expect(MappingSingleCharConverter.CONTROL.keys).to.deep.equal(conv.keys);
	});
}

function tp_ALTERNATE_BACKSPACE() {
	it('should contain exactly one binding',
		() => expect(
			Object.keys(MappingSingleCharConverter.ALTERNATE_BACKSPACE.keys).length
			+ Object.getOwnPropertySymbols(MappingSingleCharConverter.ALTERNATE_BACKSPACE.keys).length
		).to.equal(1)
	);
	it('shoud set correct binding for ^?',
			() => expect(MappingSingleCharConverter.ALTERNATE_BACKSPACE.keys['\u007F'])
					.to.deep.equal(new Key(Key.GENERIC, 0, '\b')));
}

t_MappingSingleCharConverter.test();
