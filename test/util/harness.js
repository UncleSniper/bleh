'use strict';

const expect = require('chai').expect;

const MethodNotImplementedException = require('../../lib/MethodNotImplementedException.js');

const classColor = '\u001b[38;5;39m';
const methodColor = '\u001b[38;5;34m';
const propertyColor = '\u001b[38;5;208m';
const hashColor = '\u001b[38;5;205m';
const parenColor = '\u001b[38;5;93m';
const endColor = '\u001b[39m';

Function.prototype.test = function() {
	var name;
	if(!this.name)
		name = '?';
	else if(this.name.startsWith('t_'))
		name = classColor + this.name.substr(2) + endColor;
	else if(this.name.startsWith('tm_'))
		name = hashColor + '#' + methodColor +this.name.substr(3) + parenColor + '()' + endColor;
	else if(this.name.startsWith('tp_'))
		name = hashColor + '#' + propertyColor + this.name.substr(3) + endColor;
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
