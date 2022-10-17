import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

// import "./tasks/ERC20-tasks.ts";

import * as dotenv from "dotenv";
dotenv.config();

const alfajores_URL = `https://alfajores-forno.celo-testnet.org`;
const mumbai_URL = `https://rpc-mumbai.maticvigil.com`;
const bsctest_URL = `https://data-seed-prebsc-1-s1.binance.org:8545`;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    alfajores: {
      url: alfajores_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygonMumbai: {
      url: mumbai_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      // chainId: 80001,
    },
    bscTestnet: {
      url: bsctest_URL || "",
      chainId: 97,
      gasPrice: 20000000000,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
  // etherscan: {
  //   apiKey: process.env.POLYGONSCAN_API_KEY,
  // },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
};

export default config;

console.log(process.env.PRIVATE_KEY);
