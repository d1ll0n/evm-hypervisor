'use strict';

const leftZeroPadToByteLength = (s, n) => {
	if (typeof s === 'number') s = s.toString(16);
	return Array(n*2 - s.length + 1).join('0') + s;
};

module.exports = leftZeroPadToByteLength;
