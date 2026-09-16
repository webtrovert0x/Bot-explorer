// Sources flattened with hardhat v2.29.1 https://hardhat.org

// SPDX-License-Identifier: MIT

// File contracts/ExplorerPayment.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ExplorerPayment
 * @dev On-chain payment receiver and scan registry for Explorer Bot on Bohr Network.
 * Charges 0.1 BOT (native token) per wallet scan.
 */
contract ExplorerPayment {
    address public owner;
    uint256 public scanFee = 0.1 ether; // 0.1 BOT
    uint256 public totalScans;
    uint256 public totalFeesCollected;

    // Scan record
    struct ScanRecord {
        address payer;
        address targetWallet;
        uint256 feePaid;
        uint256 timestamp;
    }

    // Mapping: scanId => ScanRecord
    mapping(uint256 => ScanRecord) public scanRecords;
    
    // Mapping: targetWallet => number of times scanned
    mapping(address => uint256) public walletScanCount;

    // Mapping: payer => lifetime scans purchased
    mapping(address => uint256) public userScanCount;

    // Events
    event ScanPaid(
        uint256 indexed scanId,
        address indexed payer,
        address indexed targetWallet,
        uint256 feePaid,
        uint256 timestamp
    );
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Pay 0.1 BOT to trigger an on-chain wallet intelligence scan
     * @param targetWallet The wallet address being investigated
     */
    function payForScan(address targetWallet) external payable returns (uint256 scanId) {
        require(msg.value >= scanFee, "Insufficient scan fee. Required: 0.1 BOT");
        require(targetWallet != address(0), "Invalid target wallet");

        scanId = ++totalScans;
        totalFeesCollected += msg.value;
        walletScanCount[targetWallet]++;
        userScanCount[msg.sender]++;

        scanRecords[scanId] = ScanRecord({
            payer: msg.sender,
            targetWallet: targetWallet,
            feePaid: msg.value,
            timestamp: block.timestamp
        });

        emit ScanPaid(scanId, msg.sender, targetWallet, msg.value, block.timestamp);

        // Refund any excess payment
        if (msg.value > scanFee) {
            uint256 excess = msg.value - scanFee;
            (bool refunded, ) = payable(msg.sender).call{value: excess}("");
            require(refunded, "Refund failed");
        }
    }

    /**
     * @notice Update the scan fee (onlyOwner)
     */
    function setScanFee(uint256 _newFee) external onlyOwner {
        uint256 oldFee = scanFee;
        scanFee = _newFee;
        emit FeeUpdated(oldFee, _newFee);
    }

    /**
     * @notice Withdraw accumulated BOT revenue to owner
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner, balance);
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @notice Get recent scan summary stats
     */
    function getStats() external view returns (
        uint256 _totalScans,
        uint256 _totalFees,
        uint256 _currentFee,
        uint256 _contractBalance
    ) {
        return (totalScans, totalFeesCollected, scanFee, address(this).balance);
    }

    receive() external payable {
        totalFeesCollected += msg.value;
    }
}
