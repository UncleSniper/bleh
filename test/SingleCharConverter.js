'use strict';

const harness = require('./util/harness.js');
const abstractmeth = harness.abstractmeth;
const expect = require('chai').expect;
const bleh = require('../bleh.js');
const SingleCharConverter = bleh.SingleCharConverter;

Function.mochaDescribe = describe;
Function.mochaIt = it;

function t_SingleCharConverter() {
	tm_charToKey.test();
}

function tm_charToKey() {
	abstractmeth(new SingleCharConverter(), 'charToKey');
}

t_SingleCharConverter.test();
