const axios = require('axios');

require('dotenv').config();

import { pinToIPFS } from './pinata.js'

const FormData = require('form-data')

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const contractAddress = "0x0eEF58876195d36b3D4b71Df19c5ABAe5B69deE9";


export const mintNFT = async(walletAddress, imgBlob, metadata, tokenContract, tokenId, chain) => {

    //make metadata
    const butcheredMetadata = new Object();
    butcheredMetadata.name = "Butchered " + metadata[0].nftName;
    butcheredMetadata.minterAddress = walletAddress;
    butcheredMetadata.description = "bad butcher description";
    butcheredMetadata.butcheredChain = chain;
    butcheredMetadata.projectName = "BAD BUTCHER";
    butcheredMetadata.butcheredContract = tokenContract;
    butcheredMetadata.butcheredTokenId = tokenId;
    butcheredMetadata.ownerOfButcheredToken = metadata[0].owner;
    butcheredMetadata.butcheredProjectName = metadata[0].projectName;
    butcheredMetadata.butcheredSymbol = metadata[0].symbol;
    butcheredMetadata.butcheredRoyaltyHolder = metadata[0].royaltyHolder;
    butcheredMetadata.butcheredRoyaltyAmount = metadata[0].royaltyAmount;
    butcheredMetadata.symbol = "BTCHR"
    
    // call out to api with imageBlob + metadata

    // login to get token

    // take token out of cookies

    // call with metadata + image blob

    /*
    try{ 
        const writeData = await axios.post(process.env.REACT_APP_NODE_API, {"image": imgBlob, "metadata": butcheredMetadata}, 
            { headers: { 'Content-Type': 'application/json' } } )
    
            console.log(writeData.data.message);
    
    } catch(error){
        console.log(error)
        return {
            success: false,
            status: error
        }
    }
    */

    /*
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract 
    };

    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
    */
}



