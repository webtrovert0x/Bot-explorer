const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ExplorerPayment Contract", function () {
  let paymentContract;
  let owner;
  let user1;
  let user2;
  const targetWallet = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const ExplorerPayment = await ethers.getContractFactory("contracts/ExplorerPayment.sol:ExplorerPayment");
    paymentContract = await ExplorerPayment.deploy();
    await paymentContract.waitForDeployment();
  });

  it("Should initialize with correct owner and 0.1 BOT scan fee", async function () {
    expect(await paymentContract.owner()).to.equal(owner.address);
    expect(await paymentContract.scanFee()).to.equal(ethers.parseEther("0.1"));
  });

  it("Should allow user to pay 0.1 BOT for a pro scan and emit event", async function () {
    const fee = ethers.parseEther("0.1");
    await expect(
      paymentContract.connect(user1).payForScan(targetWallet, { value: fee })
    )
      .to.emit(paymentContract, "ScanPaid")
      .withArgs(1, user1.address, targetWallet, fee, (val) => val > 0);

    expect(await paymentContract.totalScans()).to.equal(1);
    expect(await paymentContract.totalPaidScans()).to.equal(1);
    expect(await paymentContract.walletScanCount(targetWallet)).to.equal(1);
    expect(await paymentContract.userScanCount(user1.address)).to.equal(1);
  });

  it("Should allow user to register a free tier scan on-chain (gas only, 0 protocol fee)", async function () {
    await expect(
      paymentContract.connect(user2).registerFreeScan(targetWallet)
    )
      .to.emit(paymentContract, "FreeScanRegistered")
      .withArgs(1, user2.address, targetWallet, (val) => val > 0);

    expect(await paymentContract.totalScans()).to.equal(1);
    expect(await paymentContract.totalFreeScans()).to.equal(1);
    expect(await paymentContract.walletScanCount(targetWallet)).to.equal(1);
    expect(await paymentContract.userScanCount(user2.address)).to.equal(1);
    expect(await paymentContract.totalFeesCollected()).to.equal(0);
  });

  it("Should reject payment if less than scan fee", async function () {
    const lowFee = ethers.parseEther("0.05");
    await expect(
      paymentContract.connect(user1).payForScan(targetWallet, { value: lowFee })
    ).to.be.revertedWith("Insufficient scan fee. Required: 0.1 BOT");
  });

  it("Should allow owner to update scan fee", async function () {
    const newFee = ethers.parseEther("0.2");
    await paymentContract.connect(owner).setScanFee(newFee);
    expect(await paymentContract.scanFee()).to.equal(newFee);
  });

  it("Should allow owner to withdraw collected fees", async function () {
    const fee = ethers.parseEther("0.1");
    await paymentContract.connect(user1).payForScan(targetWallet, { value: fee });

    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
    const tx = await paymentContract.connect(owner).withdrawFees();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    expect(finalOwnerBalance + gasUsed - initialOwnerBalance).to.equal(fee);
  });
});
