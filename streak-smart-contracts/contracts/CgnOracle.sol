// contracts/CgnOracle.sol
// SPDX‑License‑Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Oracle for STREAK/NGN price, pushed by CGN‑Co’s relayer
contract CgnOracle is Ownable {
  /// @dev price with 18 decimals: NGN per STREAK
  uint256 public price;
  uint256 public lastUpdated;

  /// @notice Called by CGN‑Co relayer to set new price
  function updatePrice(uint256 _price) external onlyOwner {
    require(_price > 0, "invalid price");
    price = _price;
    lastUpdated = block.timestamp;
  }

  /// @notice View current STREAK→NGN price
  function getPrice() external view returns (uint256) {
    return price;
  }
}
