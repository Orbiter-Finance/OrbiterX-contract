// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    uint8 private precision;
    constructor(
        uint256 initialSupply,
        uint8 _precision,
        string memory _symbol
    ) ERC20("TestToken", _symbol) {
        precision = _precision;
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return precision;
    }
}
