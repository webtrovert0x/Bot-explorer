const hre = require("hardhat");

async function main() {
  console.log("-----------------------------------------------");
  console.log("Deploying ExplorerPayment to BOT Chain Mainnet...");
  console.log("Chain ID:", hre.network.config.chainId || 677);
  console.log("RPC:", hre.network.config.url || "https://rpc.botchain.ai");

  const [deployer] = await hre.ethers.getSigners();
  if (deployer) {
    console.log("Deployer address:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Deployer balance:", hre.ethers.formatEther(balance), "BOT");
  }

  const ExplorerPayment = await hre.ethers.getContractFactory("contracts/ExplorerPayment.sol:ExplorerPayment");
  const paymentContract = await ExplorerPayment.deploy();
  await paymentContract.waitForDeployment();

  const contractAddress = await paymentContract.getAddress();
  const explorerBase = hre.network.config.chainId === 677 ? "https://scan.botchain.ai" : "https://scan.bohr.life";
  console.log("-----------------------------------------------");
  console.log("✅ ExplorerPayment deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Default Scan Fee: 0.1 BOT");
  console.log("Block Explorer:", `${explorerBase}/address/${contractAddress}`);
  console.log("-----------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
