require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY = "00000000000000000000000000000000000";
const GOERLI_PRIVATE_KEY = "0000000000000000000000000000000000000000000000000000000000000000"


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};