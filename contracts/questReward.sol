// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract QuestReward is Ownable, ReentrancyGuard, Pausable {
    using MessageHashUtils for bytes32;
    using ECDSA for bytes32;

    address private signer;

    // Mapping to store claim status
    mapping(bytes32 => bool) public claimed;

    // Events
    event RewardClaimed(
        address indexed player,
        address indexed token,
        uint256 indexed campaignId,
        uint256 amount
    );
    event SignerUpdated(address indexed newSigner);
    event ETHWithdrawn(address indexed receiver, uint256 amount);
    event TokenWithdrawn(address indexed receiver, address indexed token, uint256 amount);
    event PausedByAdmin(address indexed admin);
    event UnpausedByAdmin(address indexed admin);

    constructor(address _signer) Ownable(msg.sender) {
        signer = _signer;
    }

    function setSigner(address newSigner) external onlyOwner {
        signer = newSigner;
        emit SignerUpdated(newSigner);
    }

    function getSigner() external view returns (address) {
        return signer;
    }

    function claimReward(
        address token,
        uint256 campaignId,
        uint256 amount,
        bytes memory signature
    ) external nonReentrant whenNotPaused {
        bytes32 claimKey = _getClaimKey(msg.sender, token, campaignId);

        require(!claimed[claimKey], "Already claimed for this token & campaign");
        require(_verify(msg.sender, token, campaignId, amount, signature), "Invalid signature");

        claimed[claimKey] = true;

        if (token == address(0)) {
            require(address(this).balance >= amount, "Insufficient ETH balance");
            (bool sent, ) = payable(msg.sender).call{value: amount}("");
            require(sent, "ETH transfer failed");
        } else {
            require(IERC20(token).transfer(msg.sender, amount), "Token transfer failed");
        }

        emit RewardClaimed(msg.sender, token, campaignId, amount);
    }

    function checkClaimStatus(
        address player,
        address token,
        uint256 campaignId
    ) external view returns (bool) {
        return claimed[_getClaimKey(player, token, campaignId)];
    }

    function hasClaimed(
        address player,
        address token,
        uint256 campaignId
    ) external view returns (bool) {
        return claimed[_getClaimKey(player, token, campaignId)];
    }

    function withdrawETH(address receiver, uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Insufficient ETH balance");
        (bool sent, ) = payable(receiver).call{value: amount}("");
        require(sent, "ETH transfer failed");

        emit ETHWithdrawn(receiver, amount);
    }

    function withdrawTokens(address receiver, address token, uint256 amount) external onlyOwner nonReentrant  {
        require(IERC20(token).transfer(receiver, amount), "Token transfer failed");

        emit TokenWithdrawn(receiver, token, amount);
    }

    function pause() external onlyOwner {
        _pause();
        emit PausedByAdmin(msg.sender);
    }

    function unpause() external onlyOwner {
        _unpause();
        emit UnpausedByAdmin(msg.sender);
    }

    function _getClaimKey(
        address player,
        address token,
        uint256 campaignId
    ) internal view returns (bytes32) {
        return keccak256(abi.encode(player, token, campaignId, address(this)));
    }

    function _verify(
        address player,
        address token,
        uint256 campaignId,
        uint256 amount,
        bytes memory signature
    ) internal view returns (bool) {
        bytes32 dataHash = keccak256(
            abi.encodePacked(player, token, campaignId, amount, address(this), block.chainid)
        );
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(dataHash);

        return ECDSA.recover(ethSignedMessageHash, signature) == signer;
    }

    receive() external payable {}
}
