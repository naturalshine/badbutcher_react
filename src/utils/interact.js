import { pinToIPFS } from './pinata.js'

require('dotenv').config();

const FormData = require('form-data')

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const contractAddress = "0x0eEF58876195d36b3D4b71Df19c5ABAe5B69deE9";


export const mintNFT = async(imgBlob, metadata, tokenContract, tokenId, chain) => {

    const formData = new FormData();
    formData.append('file', imgBlob);

    const imgMetadata = JSON.stringify({
      name: "Butchered " + metadata[0].nftName,
    });
    
    formData.append('pinataMetadata', imgMetadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    })

    formData.append('pinataOptions', options);
    
    const pinataResponseImg = await pinToIPFS("pinFileToIPFS", formData);
    
    if (!pinataResponseImg.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your image.",
        }
    } 
    
    //console.log("From pinanta, image upload => ", pinataResponseImg.pinataUrl);
   
    //make metadata
    const butcheredMetadata = new Object();
    butcheredMetadata.name = "Butchered " + metadata[0].nftName;
    butcheredMetadata.image = pinataResponseImg.pinataUrl;
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


    //metadata.attributes =  [{"trait_type": "flower","value": "pansy"},{"trait_type": "color","value": "orange"}];
   
    //make pinata call
    const pinataResponse = await pinToIPFS("pinJSONToIPFS", butcheredMetadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    } 


    const tokenURI = pinataResponse.pinataUrl;  

    return {
      success: true, 
      status: tokenURI  + " " + pinataResponseImg.pinataUrl
    }

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



