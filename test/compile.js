const fs = require('fs');
const path = require('path');
const easySolc = require('./lib/easy-solc')
const compileHuff = require('./lib/easy-huff')

const contractsPath = path.join(__dirname, 'contracts')

const vmPath = path.join(__dirname, '..', 'src');

const kvPath = path.join(contractsPath, 'KeyValueTest.sol')
const kvSource = fs.readFileSync(kvPath, 'utf8')

const runPath = path.join(contractsPath, 'VmRunTest.sol')
const runSource = fs.readFileSync(runPath, 'utf8')

/* const abiPath = path.join(contractsPath, 'AbiTest.sol')
const abiSource = fs.readFileSync(abiPath, 'utf8') */

const compile = ({kv = true, rt = true, basic = true} = {}) => {
  const Hypervisor = compileHuff(vmPath, 'hypervisor.huff', 'INITIALIZE_HYPERVISOR');
  const Basic = compileHuff(contractsPath, 'basic.huff', 'DO_MATH_RETURN');
  // const AbiTest = { bytecode, abi } = kv && easySolc.compile('AbiTest', abiSource, false);
	const KeyValueTest = { bytecode, deployedBytecode, abi } = kv && easySolc.compile('KeyValueTest', kvSource, false);
  const VmRunTest = { bytecode, deployedBytecode, abi } = rt && easySolc.compile('VmRunTest', runSource, false);
  // console.log(VmRunTest.abi)
  return {
    // AbiTest,
    Basic,
    Hypervisor,
    KeyValueTest,
    VmRunTest
  }
}
// compile()
module.exports = compile;
