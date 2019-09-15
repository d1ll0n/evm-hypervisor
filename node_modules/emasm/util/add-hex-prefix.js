'use strict';

const addHexPrefix = (s) => s.substr(0, 2) === '0x' ? s : '0x' + s;

module.exports = addHexPrefix;
