import Moralis  from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

require('dotenv').config();

const axios = require('axios');


const moralisKey = process.env.REACT_APP_MORALIS_KEY;
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;

export const fetchImage = async (img) => {
    const res = await fetch(img);
    console.log(res);
    const imageBlob = await res.blob();
    console.log(imageBlob)
    return imageBlob
  };

export const retrieveMetadata = async(address, tokenId, chain) => {
    // //https://docs.moralis.io/web3-data-api/reference/get-nft-metadata
    // add "Chain" as param --> needs to be in form 
    // also for solana: https://docs.moralis.io/web3-data-api/reference/get-sol-nft-metadata
    // n.b the first returns normalised metadata incl image url; 
    // solana returns json metadata file that must be read & "image" item extracted ++
    
    console.log("tokenContract => ", address);
    console.log("tokenId =>", tokenId);
    console.log("chain =>", chain);

    

    let incomingChain, response, fullData, imageUrl, nftName, projectName, owner, normalizedMetadata, fullMetadata, symbol; 
    incomingChain = chain; 

    try {

        //todo: add additional chains
        switch(chain){
            case "Ethereum":
                chain = EvmChain.ETHEREUM;
                break;
            case "Polygon":
                chain = EvmChain.POLYGON;
                break;
            case "Solana":
                chain = "Solana";
                break;
            default:
                chain = EvmChain.ETHEREUM;
        }

        await Moralis.start({
            apiKey: moralisKey
        });

        if (!(chain == "Solana")){
                let normalizeMetadata = true; 
                let format = "decimal";

                response = await Moralis.EvmApi.nft.getNFTMetadata({
                    address,
                    tokenId,
                    chain,
                    normalizeMetadata
                });
            

        } else {

            const { SolNetwork } = require('@moralisweb3/common-sol-utils');

            const solMainnet = SolNetwork.MAINNET;

            response = await Moralis.SolApi.nft.getNFTMetadata({
                address,
                solMainnet
            });
            
        }

        console.log(response?.result);
        console.log(response?.result._data.normalizedMetadata.image);

        fullData = response?.result._data;
        imageUrl = await handleUrl(response?.result._data.normalizedMetadata.image);
        nftName = response?.result._data.normalizedMetadata.name != null ? response?.result._data.normalizedMetadata.name : response?.result._data.name; 
        projectName = response?.result._data.name;
        owner = response?.result._data.ownerOf._value;
        normalizedMetadata = response?.result._data.normalizedMetadata;
        fullMetadata = response?.result._data.metadata;
        symbol = response?.result._data.symbol;

    } catch (error){
        console.log(error);
        return {
            success: false,
            message: error,
            metadata: [{"address": address, "tokenId": tokenId, "chain": incomingChain}]
        };
    }

    // TRY TO RETRIEVE ETH ROYALTIES

    let royaltyHolder, royaltyAmount, royaltyAmountFraction;

    //Lol, I know.
    royaltyHolder = "";
    royaltyAmount = null;
    royaltyAmountFraction = null; 

    if (incomingChain == "Ethereum"){
        let contractAbiRetrieved;

        try {
          let etherscanUrl = 'https://api.etherscan.io/api?module=contract&action=getabi&address=' + address + '&apikey=' + process.env.REACT_APP_ETHERSCAN;
          console.log("ETHERSCAN URL =>", etherscanUrl);
        
          const abiResponse = await axios.get(etherscanUrl);
          console.log(abiResponse.data.result);
          contractAbiRetrieved = abiResponse.data.result;
          contractAbiRetrieved = JSON.parse(contractAbiRetrieved);
          

          if (contractAbiRetrieved == "Invalid Address Format" || contractAbiRetrieved == "Contract source code not verified"){
            console.log("Invalid Address Format OR contract source code not verified... Trying with unverified NFT ABI");
            let unverifiedContractAbi = require('../contract-abi-unverified.json')
            contractAbiRetrieved = unverifiedContractAbi;
          } 

        } catch (error) {
            console.log("error => ", error);
            return {
              success: false,
              metadata: error.message
            };
        }
        
        let contract;
        const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
        const web3 = createAlchemyWeb3(alchemyKey);

        try {
            contract = new web3.eth.Contract(contractAbiRetrieved, address);
            const dummySalePrice =  web3.utils.toBN(String(1000) + "0".repeat(11));
            [royaltyHolder, royaltyAmount] = await contract.methods.royaltyInfo(tokenId, dummySalePrice).call();
            

            royaltyAmount = royaltyAmount.toString();
            royaltyAmount = parseInt(royaltyAmount);
            royaltyAmountFraction = royaltyAmount/1000;
      
         } catch (error) {
           console.log("Contract ABI error or no royalty info avaialable => ", error);

        }

    }

    //const writeData = await pg_model.createMerchant(tokenContract, tokenId, image, royaltyHolder, royaltyAmountFraction, null )
  
    //console.log("WRITE DATA =>", writeData);
    /*
    const writeData = await axios.post(process.env.REACT_APP_NODE_API+"/merchants", { tokenContract, tokenId, image, royaltyHolder, royaltyAmountFraction}, 
      { headers: { 'Content-Type': 'application/json' } } )
  
    console.log(writeData.data.message);
    */

    let returnMetadata = [{
        "contract": address, 
        "tokenId": tokenId, 
        "chain": chain, 
        "image": imageUrl, 
        "nftName": nftName, 
        "projectName": projectName, 
        "owner": owner, 
        "symbol": symbol, 
        "normalizedMetadata": normalizedMetadata, 
        "fullMetadata": fullMetadata, 
        "royaltyHolder": royaltyHolder, 
        "royaltyAmount": royaltyAmountFraction,
        "fullData": fullData
    }]
    
    console.log(returnMetadata);
  
    return {
      success: true,
      message: "Metadata retrieved",
      metadata: returnMetadata
    }
  
  };
  
  async function handleUrl(rawUrl) {
    if (rawUrl.startsWith('https')){
        return rawUrl; 
  
    } else if (rawUrl.startsWith('ipfs')){
    
        const URL = "https://butcher.infura-ipfs.io/ipfs/"
        const hash = rawUrl.replace(/^ipfs?:\/\//, '')
        const ipfsURL = URL + hash
    
        console.log("Ipfs identified =>", ipfsURL)
        return ipfsURL;
  
    } else if (rawUrl.startsWith('arweave')){
        //is there an arweave standard hash -- or retrieve hash + reliable host?
        return rawUrl;
  
    } else {
        return rawUrl;
    }
  
  }