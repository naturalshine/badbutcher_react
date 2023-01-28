const axios = require('axios');

require('dotenv').config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const contractAddress = "0x0eEF58876195d36b3D4b71Df19c5ABAe5B69deE9";


export const mintEth = async(walletAddress, data) => {
    try{

        window.contract = await new web3.eth.Contract(contractABI, contractAddress);

        const finalRoyalty = Math.trunc(data.royaltyAmount * 100)

        //set up your Ethereum transaction
        const transactionParameters = {
            to: contractAddress,
            from: window.ethereum.selectedAddress,
            'data': window.contract.methods.mintNFT(walletAddress, data.ipfsMetadata, data.royaltyHolder, finalRoyalty).encodeABI() 
        };

        //sign transaction via Metamask
        let etherscan, ethTokenId;
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        
        // TODO how to get token id? 
        ethTokenId = ""
        etherscan = "https://goerli.etherscan.io/tx/" + txHash

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



