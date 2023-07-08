// require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-waffle');

require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: false,
        interval: [4800, 5200]
      }
    },
    mumbai: {
      // Infura
      url: `${process.env.MUMBAI_URL}${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  solidity: {
    version: "0.8.14",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};
