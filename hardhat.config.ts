import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// import "./tasks/ERC20-tasks.ts";

import * as dotenv from "dotenv";
dotenv.config();

const alfajores_URL = `https://alfajores-forno.celo-testnet.org`;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    alfajores: {
      url: alfajores_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],

      // chainId: 44787,
    },
    // Add these lines -----------

    // ---------------------------
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD",
  // },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};

export default config;

console.log(process.env.PRIVATE_KEY);
