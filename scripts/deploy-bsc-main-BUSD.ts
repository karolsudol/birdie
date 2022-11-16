import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.PUBLIC_ADDRESS_PROD;
const BUSD = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
const operatorWalletAddress = "0x702D8Ef9255505378922F4A0206542a7DcF6947B";

async function main() {
  const deployer = OWNER_ADDRESS;
  const currency = BUSD;
  const fw = operatorWalletAddress;

  console.log("Deploying contract with the account:", deployer);

  const TravelSaver = await ethers.getContractFactory("TravelSaver");
  const travelSaver = await TravelSaver.deploy(currency, fw);

  await travelSaver.deployed();

  console.log(
    "TravelSaver BUSD in bsc main, deployed to:",
    travelSaver.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
