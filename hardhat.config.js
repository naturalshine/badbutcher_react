/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers"); 

module.exports = {
   solidity: "0.8.2",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      goerli: {
         url: "https://eth-goerli.g.alchemy.com/v2/",
         accounts: [`0x${process.env.GOERLI_KEY}`]
      },
      ethereum: {
         url: "https://eth-mainnet.g.alchemy.com/v2/",
         accounts: [`0x${process.env.ETHEREUM_KEY}`]
      }
   },
}
 