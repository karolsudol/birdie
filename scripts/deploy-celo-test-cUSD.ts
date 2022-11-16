import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.PUBLIC_ADDRESS_TEST;
const cUSD = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
const operatorWalletAddress = "0x2b5Fc7f001a173D49B29e34993bB2feF41Ccd803";

async function main() {
  const deployer = OWNER_ADDRESS;
  const currency = cUSD;
  const fw = operatorWalletAddress;

  console.log("Deploying contract with the account:", deployer);

  const TravelSaver = await ethers.getContractFactory("TravelSaver");
  const travelSaver = await TravelSaver.deploy(currency, fw);

  await travelSaver.deployed();

  console.log(
    "TravelSaver cUSD in Alfajores, deployed to:",
    travelSaver.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
