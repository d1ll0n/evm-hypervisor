pragma solidity 0.5.11;

contract VmRunTest {
  address _kvAddress;
  address _vmAddress;

  constructor(address kvAddress, address vmAddress) public {
    _kvAddress = kvAddress;
    _vmAddress = vmAddress;
  }

  /* function testInputData(address theContract, bytes memory callData) public returns (bytes memory) {
    address kv = _kvAddress;
    address vm = _vmAddress;
    uint256 size = fullCalldata.length;
    bool success;
    uint256 fullSize = 0x40 + size;
    bytes memory resp = abi.encode((address, bytes), ())
    assembly {
      let freePtr := add(resp, 0x20)
      let fullSize := add(0x40, size)
      mstore(freePtr, kv)
      mstore(add(freePtr, 0x20), size)
      calldatacopy(add(freePtr, 0x40), 0x00, size)
    }
    return resp;
  } */

  /* function runWithVm(address to, bytes memory callData) public {
    bytes memory _calldata = abi.encode(to, callData);
    address vm = _vmAddress;
    bool success;
    assembly {
      success := delegatecall(gas, vm, add(_calldata, 0x20), mload(_calldata), 0, 0)
      let size := returndatasize
      returndatacopy(0, 0, size)
      if iszero(success) { revert(0, size) }
      return(0, size)
    }
  } */

  function() external payable {
    address vm = _vmAddress;
    assembly {
      let ptr := mload(0x40)
      calldatacopy(ptr, 0, calldatasize)
      let success := delegatecall(gas, vm, ptr, calldatasize, 0, 0)
      if iszero(success) { revert(0, returndatasize) }
      return(0, returndatasize)
    }
  }
}