import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const USDC = "0xF631933E685441404012A558a95990dD6aB66096";
const operatorWalletAddress = "0x2b5Fc7f001a173D49B29e34993bB2feF41Ccd803";

async function main() {
  const deployer = OWNER_ADDRESS;
  const usdc = USDC;
  const fw = operatorWalletAddress;

  console.log("Deploying contract with the account:", deployer);

  const TravelSaver = await ethers.getContractFactory("TravelSaver");
  const travelSaver = await TravelSaver.deploy(usdc, fw);

  await travelSaver.deployed();

  console.log("TravelSaver deployed to:", travelSaver.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
