const axios = require('axios');

require('dotenv').config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const contractAddress = "0x0eEF58876195d36b3D4b71Df19c5ABAe5B69deE9";


export const mintNFT = async(walletAddress, imgBlob, metadata, tokenContract, tokenId, chain) => {
    console.log("WALLET ADDRESS => ", walletAddress);

    function blobToBase64(blob) {
        return new Promise((resolve, _) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

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
    butcheredMetadata.attributes.push({"trait_type": "butcheredRoyalty", "value":  metadata[0].royaltyAmount});
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

    
    let imgReturn, imgToSend, nft;    

    try {
        imgToSend = await blobToBase64(imgBlob);

        let data = {"image": imgToSend}
        imgReturn = await axios.post(process.env.REACT_APP_BUTCHER_API + '/upload', data, {
            headers: {
                'authorization' : 'Bearer ' + jwt,
                'Content-Type' : 'application/json'
            }
        }) 
        
        console.log("ID =>", imgReturn.data.id);

        // call out to api with imageBlob + metadata
        nft = await axios.post(process.env.REACT_APP_BUTCHER_API + '/butcher', 
            {"metadata": [butcheredMetadata], "butcherId": imgReturn.data.id }, 
            { headers: { 'Content-Type': 'application/json', 'authorization' : 'Bearer ' + jwt } 
        });
        
        console.log(nft.data.ipfsMetadata);
    
    } catch(error){
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }    
    }
    
    
    const ipfsMetadata = nft.data.ipfsMetadata;
    const ipfsImage = nft.data.ipfsImage;
    const royaltyHolder = nft.data.royaltyHolder;
    const royaltyAmount = nft.data.royaltyAmount;
    const finalMetadata = nft.data.finalMetadata;

    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    const finalRoyalty = Math.trunc(royaltyAmount * 100)

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.mintNFT(walletAddress, ipfsMetadata, royaltyHolder, finalRoyalty).encodeABI() //make call to NFT smart contract 
    };

    //sign transaction via Metamask
    let etherscan, ethTokenId;
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        
        // how to get token id? 
        ethTokenId = ""
        etherscan = "https://goerli.etherscan.io/tx/" + txHash
        
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }

    // mint polygon
    let polygonMint;
    const polyData = {}
    polyData.id = nft.data.id;
    polyData.ethTokenId = ethTokenId;

    try{
        polygonMint = await axios.post(process.env.REACT_APP_BUTCHER_API + '/mint', polyData, {
            headers: {
                'authorization' : 'Bearer ' + jwt,
                'Content-Type' : 'application/json'
            }
        }) ;
    } catch (error) {
        console.log(error);
    }



    return {
        success: true,
        polygonTokenId: polygonMint.polygonTokenId,
        ethTokenId: ethTokenId,
        ipfsMetadata: ipfsMetadata,
        ipfsImage: ipfsImage, 
        royaltyHolder: royaltyHolder,
        royaltyAmount: royaltyAmount,
        finalMetadta: finalMetadata,
    }
    
}



