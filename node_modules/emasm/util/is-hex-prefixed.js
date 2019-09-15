'use strict';

const isHexPrefixed = (s) => s.substr(0, 2) === '0x';

module.exports = isHexPrefixed;
