'use strict';

const harness = require('./util/harness.js');
const propthru = harness.propthru;
const abstractmeth = harness.abstractmeth;
const expect = require('chai').expect;
const bleh = require('../bleh.js');
const InputConverter = bleh.InputConverter;
const Stage = InputConverter.Stage;

Function.mochaDescribe = describe;
Function.mochaIt = it;

function t_InputConverter() {
	tm_newSequence.test();
	t_Stage.test();
}

function tm_newSequence() {
	abstractmeth(new InputConverter(), 'newSequence');
}

function t_Stage() {
	tm_getCurrentKey.test();
	tp_currentKey.test();
	tm_isInputLeaf.test();
	tp_inputLeaf.test();
	tm_getNextStage();
}

function tm_getCurrentKey() {
	abstractmeth(new Stage(), 'getCurrentKey');
}

function tp_currentKey() {
	propthru(new Stage(), 'getCurrentKey', 'currentKey');
}

function tm_isInputLeaf() {
	abstractmeth(new Stage(), 'isInputLeaf');
}

function tp_inputLeaf() {
	propthru(new Stage(), 'isInputLeaf', 'inputLeaf');
}

function tm_getNextStage() {
	abstractmeth(new Stage(), 'getNextStage');
}

t_InputConverter.test();
