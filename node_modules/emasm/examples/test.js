'use strict';

const rpcCall = require('kool-makerpccall');

const emasm = require('../');

(async () => {
  console.log(Number(await rpcCall('https://mainnet.infura.io/mew', 'eth_call', [{
	  data: emasm(['gas', '0x0', 'mstore', '0x20', '0x0', 'return'])
  }, 'latest'])));
})()
