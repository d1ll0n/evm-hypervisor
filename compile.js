'use strict';

const makeEvmvm = require('./emasm/evmvm');
const emasm = require('emasm');

module.exports = () => emasm(makeEvmvm());
