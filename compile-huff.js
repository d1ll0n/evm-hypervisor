'use strict';

const fs = require('fs');
const path = require('path');
const {
	parser
} = require('@aztec/huff');
const emasm = require('emasm');
const makeConstructor = require('emasm/macros/make-constructor');
const addHexPrefix = (s) => s.substr(0, 2) === '0x' ? s : '0x' + s;

function compile() {
	const { inputMap, macros, jumptables } = parser.parseFile('evmvm.huff', path.join(__dirname, 'huff_modules'));
	const {
		data: { bytecode, sourcemap }
	} = parser.processMacro('EVMVM_MAIN', 0, [], macros, inputMap, jumptables);
	return emasm(makeConstructor([ 'bytes:intermediate', [ addHexPrefix(bytecode) ]]));
}

module.exports = compile;
