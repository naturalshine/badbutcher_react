const axios = require('axios');

require('dotenv').config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY_GOERLI;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../../abis/contract-abi.json');
const contractAddress = process.env.REACT_APP_CONTRACT;


export const mintEth = async(walletAddress, data) => {
    try{

        window.contract = new web3.eth.Contract(contractABI, contractAddress);

        const finalRoyalty = Math.trunc(data.royaltyAmount * 100)

        //set up your Ethereum transaction
        const transactionParameters = {
            to: contractAddress,
            from: window.ethereum.selectedAddress,
            'data': window.contract.methods.mintWithRoyalty(walletAddress, data.ipfsMetadata, data.royaltyHolder, finalRoyalty).encodeABI() 
        };

        //sign transaction via Metamask
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

        txHash.on('receipt', function(receipt){
            console.log("TESTING THIS WAY of GETTING TOKEN =>", receipt.logs[0].topics[3])
        })
        
        const etherscan = "https://goerli.etherscan.io/tx/" + txHash
        console.log("ETHERSCAN => ", etherscan)
   
        let ethTokenId;
        const transactionReceipt = await web3.eth.getTransactionReceipt(txHash).then(function(data){
            let transaction = data;
            let logs = data.logs;
            ethTokenId = web3.utils.hexToNumber(logs[0].topics[3]);
            console.log("DELAYED TOKEN ID => ", ethTokenId)
        });


        return {
            success: true,
            status: "Done minting Ethereum token... Minting polygon token...",
            ethTokenId: ethTokenId,
        }

    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
       }    
    }


    
}



