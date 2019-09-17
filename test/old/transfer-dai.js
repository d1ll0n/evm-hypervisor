const solc = require('solc');
const loadRemoteVersion = (version) => new Promise((resolve, reject) => solc.loadRemoteVersion(version, (err, result) => err ? reject(err) : resolve(result)));

const fs = require('fs');
const path = require('path');
const rpcCall = require('kool-makerpccall');
const ln = (v) => (v);
const call = (method, params = []) => rpcCall(...ln(['http://localhost:8545', method, params]));
const abi = require('web3-eth-abi');
const easySolc = require('./easy-solc');
const encodeParameters = abi.encodeParameters.bind(abi);
const encodeFunctionCall = abi.encodeFunctionCall.bind(abi);

const source = fs.readFileSync(path.join(__dirname, 'DAI.sol'), 'utf8');

const addHexPrefix = (s) => s.substr(0, 2) === '0x' ? s : '0x' + s;

(async () => {
	const solc = await loadRemoteVersion('v0.4.19+commit.c4cbbb05');
	easySolc.setSolc(solc)
	const { bytecode } = easySolc.compile('DSToken', source, false, await loadRemoteVersion('v0.4.19+commit.c4cbbb05'));
  const [ from ] = await call('eth_accounts');
	const ln = (v) => ((console.log(v)), v);
  const {
		contractAddress
	} = await call('eth_getTransactionReceipt', [ await call('eth_sendTransaction', [{
		from,
		data: bytecode,
		gasPrice: 1,
		gas: 6e6
	}]) ])
	const {
		contractAddress: vmAddress
	} = await call('eth_getTransactionReceipt', [ await call('eth_sendTransaction', [{
		from,
		gas: 6e6,
		gasPrice: 1,
		data: require('../compile-huff')()
	}]) ]);
	const mintData = encodeFunctionCall({
		name: 'mint',
		inputs: [{
			name: 'wad',
			type: 'uint256'
		}]
	}, [ '1' + Array(19).join('0') ]);
	const { gasUsed: mintGasUsed } = await call('eth_getTransactionReceipt', [ await call('eth_sendTransaction', [{
		to: vmAddress,
		from,
		gasPrice: 1,
		gas: 6e6,
		data: encodeParameters([
			'address',
			'bytes'
		], [
      contractAddress,
			mintData
		])
	}]) ]);
	const { gasUsed: nativeMintGasUsed } = await call('eth_getTransactionReceipt', [ await call('eth_sendTransaction', [{
		to: contractAddress,
		from,
		data: mintData,
		gas: 6e6,
		gasPrice: 1
	}]) ])
	console.log('mint --')
	console.log('native');
	console.log(Number(nativeMintGasUsed));
	console.log('vm');
	console.log(Number(mintGasUsed));
	const transferData = encodeFunctionCall({
    name: 'transfer',
  	inputs: [{
			name: 'dst',
			type: 'address'
		}, {
			name: 'amt',
			type: 'uint256'
		}]
  }, [ '0x' + Array(40).join('0') + '1', '5' + Array(18).join('0') ])
	const { gasUsed: nativeGasUsed } = await call('eth_getTransactionReceipt', [ await call('eth_sendTransaction', [{
		to: contractAddress,
		from,
		gasPrice: 1,
		gas: 6e6,
		data: transferData
	}]) ]);
  const { gasUsed } = await call('eth_getTransactionReceipt', [ await call('eth_sendTransaction', [{
    to: vmAddress,
		from,
		gasPrice: 1,
		gas: 6e6,
		data: encodeParameters([
			'address',
			'bytes'
		], [
			contractAddress,
			transferData
		])
	}]) ]);
	console.log('transfer --');
	console.log('native');
	console.log(Number(nativeGasUsed));
	console.log('vm');
	console.log(Number(gasUsed));
})().catch((err) => console.error(err.stack)); 
