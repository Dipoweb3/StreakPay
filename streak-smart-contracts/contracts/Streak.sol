// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StreakToken is ERC20, Ownable {
    uint256 public availableForLoans;
    uint256 public lockedForRelease;
    uint256 public lastReleaseTime;
    uint256 public releaseInterval = 90 days;
    uint256 public totalSupplyLimit = 1_000_000 * 10**18;

    constructor() ERC20("Streak Token", "STREAK") Ownable(msg.sender) {
        _mint(msg.sender, totalSupplyLimit);

        availableForLoans = (totalSupplyLimit * 40) / 100;
        lockedForRelease = (totalSupplyLimit * 40) / 100;

        // Lock both pools in this contract
        _transfer(msg.sender, address(this), availableForLoans + lockedForRelease);
        lastReleaseTime = block.timestamp;
    }

    function releaseLockedTokens() external onlyOwner {
        require(block.timestamp >= lastReleaseTime + releaseInterval, "Not yet time to release");
        uint256 releaseAmount = lockedForRelease / 4;
        lockedForRelease -= releaseAmount;
        _transfer(address(this), msg.sender, releaseAmount);
        lastReleaseTime = block.timestamp;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
