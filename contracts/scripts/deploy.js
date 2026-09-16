const hre = require("hardhat");

async function main() {
  console.log("-----------------------------------------------");
  console.log("Deploying ExplorerPayment to Bohr Network...");
  console.log("Chain ID:", hre.network.config.chainId || 968);
  console.log("RPC:", hre.network.config.url || "https://rpc.bohr.life");

  const [deployer] = await hre.ethers.getSigners();
  if (deployer) {
    console.log("Deployer address:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Deployer balance:", hre.ethers.formatEther(balance), "BOT");
  }

  const ExplorerPayment = await hre.ethers.getContractFactory("ExplorerPayment");
  const paymentContract = await ExplorerPayment.deploy();
  await paymentContract.waitForDeployment();

  const contractAddress = await paymentContract.getAddress();
  console.log("-----------------------------------------------");
  console.log("✅ ExplorerPayment deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Default Scan Fee: 0.1 BOT");
  console.log("Block Explorer:", `https://scan.bohr.life/address/${contractAddress}`);
  console.log("-----------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
