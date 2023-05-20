const hre = require("hardhat");

const {ethers} = require ("hardhat");


async function main() {

const whitelistContract = await ethers.getContractFactory("whitelist");
// 10 represent the maximum number of whitelisted addresses ( _MaxWhitelistAddresses)
const DeployedWhitlistContract = await whitelistContract.deploy(10);
await DeployedWhitlistContract.deployed();
console.log("Deployed whitelist contract", DeployedWhitlistContract.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
