pragma solidity 0.5.11;

contract KeyValueTest {
  mapping(uint256 => uint256) values;
  event Spagett(uint256 spa);

  function setValue(uint256 key, uint256 value) external returns(uint256) {
    values[0] == 0xffff;
    values[key] = value;
    emit Spagett(value);
    return value;
  }

  function getValue(uint256 key) external view returns (uint256) {
    return values[key];
  }
}