import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.PUBLIC_ADDRESS_PROD;
const cUSD = "0x765de816845861e75a25fca122bb6898b8b1282a";
const operatorWalletAddress = "0x702D8Ef9255505378922F4A0206542a7DcF6947B";

async function main() {
  const deployer = OWNER_ADDRESS;
  const currency = cUSD;
  const fw = operatorWalletAddress;

  console.log("Deploying contract with the account:", deployer);

  const TravelSaver = await ethers.getContractFactory("TravelSaver");
  const travelSaver = await TravelSaver.deploy(currency, fw);

  await travelSaver.deployed();

  console.log(
    "TravelSaver cUSD in celo main, deployed to:",
    travelSaver.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
