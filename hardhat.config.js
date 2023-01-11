/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers"); 

const log = require("log");
log.info(process.env.PRIVATE_KEY)

module.exports = {
   solidity: "0.8.2",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      goerli: {
         url: "https://eth-goerli.g.alchemy.com/v2/whVSPQIIbZFIMoz4QAEjN082cjSM_qLU",
         accounts: [`0x${process.env.GOERLI_KEY}`]
      },
      polygonmumbai: {
         url: "https://polygon-mumbai.g.alchemy.com/v2/eNIltfbe066olUkZ5Q6An9vqWbUINB7u",
         accounts: [`0x${process.env.MUMBAI_KEY}`]
      },
      polygon: {
         url: "https://polygon-mainnet.g.alchemy.com/v2/nv0MZj7S8wr5vOGZXyr0qyJ-fftKx_3U",
         accounts: [`0x${process.env.POLYGON_KEY}`]
      },
      ethereum: {
         url: "https://eth-mainnet.g.alchemy.com/v2/DX841g-EE4VZL4NnV2Qd_tjGdTeavJ1_",
         accounts: [`0x${process.env.ETHEREUM_KEY}`]
      }
   },
}
 