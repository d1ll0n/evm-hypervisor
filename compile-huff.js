'use strict';

const fs = require('fs');
const path = require('path');
const {
	parser,
	Runtime: { getNewVM, Runtime }
} = require('@aztec/huff');
const emasm = require('emasm');
const makeConstructor = require('emasm/macros/make-constructor');
const addHexPrefix = (s) => s.substr(0, 2) === '0x' ? s : '0x' + s;

function compile() {
	const { inputMap, macros, jumptables } = parser.parseFile('hypervisor.huff', path.join(__dirname, 'src'));
	const {
		data: { bytecode, sourcemap }
	} = parser.processMacro('INITIALIZE_HYPERVISOR', 0, [], macros, inputMap, jumptables);
	// console.log(bytecode.length)
	return emasm(makeConstructor([ 'bytes:intermediate', [ addHexPrefix(bytecode) ]]));
	// return bytecode
}

const vm = getNewVM();
const runtime = Runtime('hypervisor.huff', path.join(__dirname, 'src'))
runtime(vm, 'HYPERVISOR__CONSTRUCTOR').then(({stack, memory, bytecode}) => {
	console.log(`bytecode size: ${(bytecode.length / 2).toString(16)}`)
	console.log(stack)
	// console.log(memory.join(''))
})


module.exports = compile;
