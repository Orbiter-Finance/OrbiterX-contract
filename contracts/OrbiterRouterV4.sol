// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title OrbiterXRouterV3
 * @dev A contract for batch transfers of Ether and tokens to multiple addresses.
 */
contract OrbiterRouterV4 {
    using SafeERC20 for IERC20;
    bool private locked;
    event TransferTo(address indexed to, uint256 amount, bytes data);
    event TransferTo(address indexed to, uint256 amount);

    /**
     * @dev Modifier to prevent reentrancy attacks.
     */
    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    /**
     * @dev Batch transfers Ether to multiple addresses.
     * @param tos The array of destination addresses.
     * @param values The array of corresponding amounts to be transferred.
     */
    function transfers(
        address[] calldata tos,
        uint[] memory values
    ) external payable nonReentrant {
        require(
            tos.length == values.length,
            "Destination and amount arrays length mismatch"
        );
        uint total = msg.value;
        uint value;
        for (uint i = 0; i < tos.length; i++) {
            value = values[i];
            require(total >= value, "Insufficient Balance");
            total -= value;
            (bool success, ) = tos[i].call{value: value}("");
            require(success, "Transfer failed");
            emit TransferTo(tos[i], value);
        }
        require(total == 0, "There are many extra costs");
    }

    function transfers(
        address[] calldata tos,
        uint[] memory values,
        bytes[] calldata extras
    ) external payable nonReentrant {
        require(
            tos.length == values.length,
            "Destination and amount arrays length mismatch"
        );
        uint total = msg.value;
        uint value;
        for (uint i = 0; i < tos.length; i++) {
            value = values[i];
            require(total >= value, "Insufficient Balance");
            total -= value;
            (bool success, ) = tos[i].call{value: value}("");
            require(success, "Transfer failed");
            emit TransferTo(tos[i], value, extras[i]);
        }
        require(total == 0, "There are many extra costs");
    }

    /**
     * @dev Batch transfers tokens to multiple addresses.
     * @param token The token contract address.
     * @param tos The array of destination addresses.
     * @param values The array of corresponding amounts to be transferred.
     */
    function transferTokens(
        IERC20 token,
        address[] calldata tos,
        uint[] memory values
    ) external payable nonReentrant {
        require(msg.value == 0, "Ether not accepted");
        require(
            tos.length == values.length,
            "Destination and amount arrays length mismatch"
        );
        for (uint i = 0; i < tos.length; i++) {
            token.safeTransferFrom(msg.sender, tos[i], values[i]);
            emit TransferTo(tos[i], values[i]);
        }
    }

    function transferTokens(
        IERC20 token,
        address[] calldata tos,
        uint[] memory values,
        bytes[] calldata extras
    ) external payable nonReentrant {
        require(msg.value == 0, "Ether not accepted");
        require(
            tos.length == values.length,
            "Destination and amount arrays length mismatch"
        );
        for (uint i = 0; i < tos.length; i++) {
            token.safeTransferFrom(msg.sender, tos[i], values[i]);
            emit TransferTo(tos[i], values[i], extras[i]);
        }
    }

    /**
     * @dev Transfer Ether to a specified address.
     * @param to The destination address.
     * @param extra Optional data included in the transaction.
     */
    function transfer(
        address to,
        bytes calldata extra
    ) external payable nonReentrant {
        (bool success, ) = to.call{value: msg.value}("");
        require(success, "Transfer failed");
        emit TransferTo(to, msg.value, extra);
    }

    /**
     * @dev Transfer tokens to a specified address.
     * @param token The token contract address.
     * @param to The destination address.
     * @param value The amount of tokens to be transferred.
     * @param extra Optional data included in the transaction.
     */
    function transferToken(
        IERC20 token,
        address to,
        uint value,
        bytes calldata extra
    ) external payable nonReentrant {
        require(msg.value == 0, "Ether not accepted");
        token.safeTransferFrom(msg.sender, to, value);
        emit TransferTo(to, msg.value, extra);
    }
}
