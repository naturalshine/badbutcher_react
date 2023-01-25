const axios = require('axios');
const FormData = require('form-data')

require('dotenv').config();


const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const contractAddress = "0x0eEF58876195d36b3D4b71Df19c5ABAe5B69deE9";


export const mintNFT = async(walletAddress, imgBlob, metadata, tokenContract, tokenId, chain) => {
    console.log("IMGBLOB INTERACT =>", imgBlob);
    let base64Img;
    // TODO PROB YOU HAVE TO MAKE 2 API CALLS
    // 1x to ADD DATA (GET ID RETURNED)

    // 1x to STORE IMAGE & TRIGGER BUTCHER ? BC THEN YOU CAN SAVE IMAGE W/DATA ID
    // OR VICE VERSA & NAME IMG W TOKEN CONTRACT + ID --> MAYBE EASIER

    //make metadata
    const butcheredMetadata = new Object();
    butcheredMetadata.name = "Butchered " + metadata[0].nftName;
    butcheredMetadata.description = "Description of Bad Butcher";
    butcheredMetadata.attributes = [];
    butcheredMetadata.attributes.push({"trait_type": "project", "value": "BAD BUTCHER"});
    butcheredMetadata.attributes.push({"trait_type": "butcheredContract", "value": tokenContract});
    if(chain !== "solana"){
        butcheredMetadata.attributes.push({"trait_type": "butcheredTokenId", "value": tokenId});
    }
    butcheredMetadata.attributes.push({"trait_type": "butcheredChain", "value": chain});
    butcheredMetadata.attributes.push({"trait_type": "butcheredName", "value": metadata[0].nftName});
    butcheredMetadata.attributes.push({"trait_type": "butcheredDescription", "value":  metadata[0].description});
    butcheredMetadata.attributes.push({"trait_type": "butcheredOwner", "value":  metadata[0].owner});
    butcheredMetadata.attributes.push({"trait_type": "butcheredSymbol", "value":  metadata[0].symbol});
    butcheredMetadata.attributes.push({"trait_type": "butcheredRoyaltyHolder", "value":  metadata[0].royaltyHolder});
    butcheredMetadata.attributes.push({"trait_type": "butcheredRoyaltyAmount", "value":  metadata[0].royaltyAmount});
    butcheredMetadata.attributes.push({"trait_type": "butcheredImageUrl", "value":  metadata[0].originalImage});
    butcheredMetadata.attributes.push({"trait_type": "butcheredMetadataUrl", "value":  metadata[0].token_uri});
    butcheredMetadata.attributes.push({"trait_type": "butcherMinter", "value": walletAddress});    
    
    // add existing attributes from original NFT
    butcheredMetadata.attributes = butcheredMetadata.attributes.concat(metadata[0].attributes);

    // login to get token
    const login = await axios.post(process.env.REACT_APP_BUTCHER_LOGIN, {"username": process.env.REACT_APP_JWT_USER, "password": process.env.REACT_APP_JWT_PASSWORD}, 
            { headers: { 'Content-Type': 'application/json' } } )
    
    const jwt = login.data.jwt

    console.log(login.data.jwt)

    // call out to api with imageBlob + metadata
    const nft = await axios.post(process.env.REACT_APP_BUTCHER_API + '/butcher', {"image": base64Img, "metadata": butcheredMetadata}, 
    { headers: { 'Content-Type': 'application/json', 'authorization' : 'Bearer ' + jwt } } )
    console.log(nft);
    
    const ipfsMetadata = nft.data.ipfsMetadata;
    const ipfsImage = nft.data.ipfsImage;
    const image = nft.data.image;
    const royaltyHolder = nft.data.royaltyHolder;
    const royaltyAmount = nft.data.royaltyAmount;
    const polygonTokenId = nft.data.tokenId;
    const polygonContract = nft.data.contract;

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



