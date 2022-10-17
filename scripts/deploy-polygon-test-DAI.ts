import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.PUBLIC_ADDRESS;
const DAI = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F";
const operatorWalletAddress = "0x2b5Fc7f001a173D49B29e34993bB2feF41Ccd803";

async function main() {
  const deployer = OWNER_ADDRESS;
  const currency = DAI;
  const fw = operatorWalletAddress;

  console.log("Deploying contract with the account:", deployer);

  const TravelSaver = await ethers.getContractFactory("TravelSaver");
  const travelSaver = await TravelSaver.deploy(currency, fw);

  await travelSaver.deployed();

  console.log(
    "TravelSaver DAI in Polygon-Mumbai, deployed to:",
    travelSaver.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
