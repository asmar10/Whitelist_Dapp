require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const GOERLI_KEY = process.env.GOERLI_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: GOERLI_KEY,
      accounts: [PRIVATE_KEY]
    }
  }
};
