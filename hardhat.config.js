require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("solidity-coverage");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const COINMARKET_API_KEY=process.env.COINMARKET_API_KEY;
const SEPOLIA_RPC_URL=process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY;
module.exports = {
  //solidity: "0.8.24",
  solidity: {
    compilers : [
      {
        version: "0.8.24",
      },
      {
        version: "0.6.6",
      }
    ]
  },

  etherscan: {
    apikey: ETHERSCAN_API_KEY,
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKET_API_KEY,
    token: "MATIC",
  },

  defaultNetwork : "hardhat",

  networks : {
    sepolia : {
      url : SEPOLIA_RPC_URL,
      chainId : 11155111,
      accounts: [PRIVATE_KEY],
      blockConfirmations: 6, 
    },
    hardhat : {
      chainId: 31337
    },
  },
  
  namedAccounts : {
    deployer : {
      default : 0,
      1:0
      
    },
    users : {
      default : 2,
    },
  }
};
