
require('dotenv').config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../abis/contract-abi.json');
const contractAddress = process.env.REACT_APP_CONTRACT;


export const retrieveEthToken = async(txHash) => {
    try{

        let ethTokenId;
        const transactionReceipt = await web3.eth.getTransactionReceipt(txHash).then(function(data){
            console.log("DATA => ", data);
            ethTokenId = web3.utils.hexToNumber(data.logs[0].topics[3]);
            console.log("DELAYED TOKEN ID => ", ethTokenId)
        });


        return {
            successRetrieve: true,
            statusRetrieve: "Token id for ETH is " + ethTokenId,
            ethTokenId: ethTokenId
        }

    } catch (error) {
        console.log("ERROR! =>", error)
        return {
            successEth: false,
            statusEth: "😥 Something went wrong: " + error.message
       }    
    }


    
}



