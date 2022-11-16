import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.PUBLIC_ADDRESS_PROD;
const USDT = "0x55d398326f99059ff775485246999027b3197955";
const operatorWalletAddress = "0x702D8Ef9255505378922F4A0206542a7DcF6947B";

async function main() {
  const deployer = OWNER_ADDRESS;
  const currency = USDT;
  const fw = operatorWalletAddress;

  console.log("Deploying contract with the account:", deployer);

  const TravelSaver = await ethers.getContractFactory("TravelSaver");
  const travelSaver = await TravelSaver.deploy(currency, fw);

  await travelSaver.deployed();

  console.log(
    "TravelSaver USDT in bsc main, deployed to:",
    travelSaver.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
