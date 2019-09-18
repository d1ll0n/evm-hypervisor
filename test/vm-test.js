const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')
const abi = require('web3-eth-abi');
const encodeParameters = abi.encodeParameters.bind(abi);

const {
  Basic,
  Hypervisor,
  KeyValueTest,
  VmRunTest,
  PcTest,
} = require('./compile')(/* {rt: false, kv: false} */)

const deploy = (from, code, abi = [], args = [], gas = 6e6, gasPrice = 1) =>
  new Promise((resolve, reject) =>
    (contract = new web3.eth.Contract(abi))
      .deploy({ data: code, arguments: args })
      .send({ from, gas, gasPrice })
      .on('receipt', receipt => (contract._address = receipt.contractAddress) && resolve(contract))
      .on('error', (err) => reject(err))
  )

let address, kv, vm, runTest, basic, pcTest;
const setup = async () => {
  address = await web3.eth.getAccounts().then(addrs => addrs[0])
  kv = await deploy(address, KeyValueTest.bytecode, KeyValueTest.abi)
  vm = await deploy(address, Hypervisor)
  runTest = await deploy(address, VmRunTest.bytecode, VmRunTest.abi, [kv._address, vm._address])
  basic = await deploy(address, Basic)
  // pcTest = await deploy(address, PcTest)
}

async function testBasic() {
  await setup()
  const inputData = encodeParameters(['uint256', 'uint256'], [100, 100])
  let calldata = encodeParameters(['address', 'bytes'], [basic._address, inputData])
  const receipt = await web3.eth.sendTransaction({
    from: address,
    to: vm._address,
    data: calldata,
    gas: 20000000,
    gasPrice: 1
  })
  console.log(receipt)
}

async function testDeploy() {
  await setup()
  const inputData = kv.methods.setValue(1, 2).encodeABI()
  const calldata = encodeParameters(['address', 'bytes'], [kv._address, inputData])
  // console.log(calldata)
  const receipt = await web3.eth.sendTransaction({
    from: address,
    to: vm._address,
    data: calldata,
    gas: 20000000,
    gasPrice: 1
  })
  console.log(receipt)
}

async function testPC() {
  await setup()
  console.log(pcTest._address)
  const receipt = await web3.eth.sendTransaction({
    from: address,
    to: vm._address,
    data: encodeParameters(['address'], [pcTest._address]),
    gas: 20000000,
    gasPrice: 1
  })
  console.log(receipt)
}

testDeploy()