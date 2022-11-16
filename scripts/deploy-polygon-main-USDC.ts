import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.PUBLIC_ADDRESS_PROD;
const USDC = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
const operatorWalletAddress = "0x702D8Ef9255505378922F4A0206542a7DcF6947B";

async function main() {
  const deployer = OWNER_ADDRESS;
  const currency = USDC;
  const fw = operatorWalletAddress;

  console.log("Deploying contract with the account:", deployer);

  const TravelSaver = await ethers.getContractFactory("TravelSaver");
  const travelSaver = await TravelSaver.deploy(currency, fw);

  await travelSaver.deployed();

  console.log(
    "TravelSaver USDC in polygon main, deployed to:",
    travelSaver.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
