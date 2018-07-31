'use strict';

const expect = require('chai').expect;

const MethodNotImplementedException = require('../../lib/MethodNotImplementedException.js');

Function.prototype.test = function() {
	var name;
	if(!this.name)
		name = '?';
	else if(this.name.startsWith('t_'))
		name = this.name.substr(2);
	else if(this.name.startsWith('tm_'))
		name = '#' + this.name.substr(3) + '()';
	else if(this.name.startsWith('tp_'))
		name = '#' + this.name.substr(3);
	else
		name = this.name;
	Function.mochaDescribe(name, this);
};

function passthru(callback) {
	const nonce = Symbol();
	expect(callback(nonce)).to.equal(nonce);
	return nonce;
}

function withIdent(base, name, value) {
	base[name] = () => value;
	return base;
}

function propthru(base, method, property) {
	Function.mochaIt('should delegate to ' + method + '()',
			() => passthru(nonce => withIdent(base, method, nonce)[property]));
}

function abstractmeth(base, method) {
	Function.mochaIt('should throw MethodNotImplementedException if not overridden',
			() => expect(() => base[method].call(base)).to.throw(MethodNotImplementedException));
}

function any(constructor, description, callback) {
	Function.mochaIt(description, () => callback(new constructor()));
}

module.exports = {
	passthru,
	withIdent,
	propthru,
	abstractmeth,
	any
};
