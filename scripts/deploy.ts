import { ethers } from "hardhat";

const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

async function main() {
  const deployer = OWNER_ADDRESS;
  console.log("Deploying contract with the account:", deployer);

  const TokenERC20 = await ethers.getContractFactory("TravelSaver");
  const erc20 = await TokenERC20.deploy(
    "0xF631933E685441404012A558a95990dD6aB66096",
    "0x2b5Fc7f001a173D49B29e34993bB2feF41Ccd803"
  );

  await erc20.deployed();

  console.log("ERC20 deployed to:", erc20.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
