'use strict';

const emasm = require('../');

// program that iteratively computes the first odd number greater than 10 by starting at 1 and adding 2 in a loop, incredibly useful

const ast = [
  ['0x0', '0x1', 'add'],
  [['label', ['0x2', 'add', 'dup1', '0x0a', 'swap1', 'lt', 'label', 'jumpi']]],
  ['0x0', 'mstore', '0x20', '0x0', 'return']
];

const payload = emasm(ast);
console.log(payload);
