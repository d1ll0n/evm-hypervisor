'use strict';

const BN = require('bn.js');
const isHexPrefixed = require('./is-hex-prefixed');
const stripHexPrefix = require('./strip-hex-prefix');

const coerceToBN = (n) => {
  switch (typeof n) {
    case 'number':
      return new BN(n);
    case 'string':
      if (isHexPrefixed(n)) return new BN(stripHexPrefix(n), 16);
      return new BN(n);
    default:
      throw Error('Invalid argument to coerceToBN: ' + n);
  }
};

module.exports = coerceToBN;
