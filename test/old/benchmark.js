'use strict';

const emasm = require('emasm');
const makeConstructor = require('emasm/macros/make-constructor');
const rpcCall = require('kool-makerpccall');
const abi = require('web3-eth-abi');
const scanner = require('./SelfdestructScanner');
const compile = require('../compile-huff');
const { encodeParameters: unboundEncode } = abi;
const encodeParameters = unboundEncode.bind(abi);

const call = (method, params = []) => rpcCall('http://localhost:8545', method, params);
(async () => {
  const [ from ] = await call('eth_accounts');
  const { contractAddress } = await call('eth_getTransactionReceipt', [ await call('eth_sendTransaction', [{
		from,
		data: scanner,
		gasPrice: 1,
		gas: 6e6
	}]) ]);
  const { contractAddress: homeworkAddress } = await call('eth_getTransactionReceipt', [ await call('eth_sendTransaction', [{
		from,
		data: emasm(makeConstructor([ 'bytes:homework', [
			require('./HomeWork')
		]])),
		gasPrice: 1,
		gas: 6e6
	}]) ]);
	console.log('did hw deploy')
	console.log(homeworkAddress)
  const { contractAddress: vmAddress } = await call('eth_getTransactionReceipt', [ await call('eth_sendTransaction', [{
		from,
		data: compile(),
		gasPrice: 1,
		gas: 6e6
	}]) ]);
/* 	console.log('did vm deploy')
	console.log(vmAddress)
	const nativeGas = await call('eth_estimateGas', [{
		to: contractAddress,
		data: encodeParameters(['address'], [ homeworkAddress ])
	}]);
	console.log(nativeGas) */
	/* console.log(await call('eth_call', [{
		to: vmAddress,
		data: encodeParameters(['address', 'bytes'], [
			contractAddress,
			encodeParameters(['address'], [ homeworkAddress ])
		]),
	}])); */
	const tx = await call('eth_sendTransaction', [{
		to: vmAddress,
		from,
		data: encodeParameters(['address', 'bytes'], [
			homeworkAddress,
			encodeParameters(['address'], [ homeworkAddress ])
		]),
		gas: 1000e6,
		gasPrice: 1
	}]);
	console.log(tx)
	const { gasUsed: vmGas } = await call('eth_getTransactionReceipt', [ tx ]);
	console.log('native gas: ' + String(Number(nativeGas)));
	console.log('vm gas: ' + String(Number(vmGas)));
})().catch((err) => console.error(err.stack));

