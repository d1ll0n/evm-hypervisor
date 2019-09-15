'use strict';

const isHexPrefixed = require('./is-hex-prefixed');
const stripHexPrefix = (s) => isHexPrefixed(s) ? s.substr(2) : s;

module.exports = stripHexPrefix;
