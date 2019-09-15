'use strict';

const createJumpTable = (jumpTableLabel, labels, size = 32) => [ 'bytes:' + jumpTableLabel, labels.map((label) => [ size, label ]) ];

module.exports = createJumpTable;
