
require('dotenv').config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../abis/contract-abi.json');
const contractAddress = process.env.REACT_APP_CONTRACT;


export const mintEth = async(walletAddress, data) => {
    try{

        console.log("minting eth... ")
        window.contract = new web3.eth.Contract(contractABI, contractAddress);

        const finalRoyalty = Math.trunc(data.royaltyAmount * 100)
        console.log("setting up tx")
        //set up your Ethereum transaction
        const transactionParameters = {
            to: contractAddress,
            from: window.ethereum.selectedAddress,
            'data': window.contract.methods.mintWithRoyalty(walletAddress, data.ipfsMetadata, data.royaltyHolder, finalRoyalty).encodeABI() 
        };
        console.log("triggering tx")
        //sign transaction via Metamask
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        console.log("tx hash =>", txHash);

        const etherscan = "https://goerli.etherscan.io/tx/" + txHash
        console.log("ETHERSCAN => ", etherscan)
        
        //let ethTokenId;
        /*
        const transactionReceipt = await web3.eth.getTransactionReceipt(txHash).then(function(data){
            console.log("DATA => ", data);
            ethTokenId = web3.utils.hexToNumber(data.logs[0].topics[3]);
            console.log("DELAYED TOKEN ID => ", ethTokenId)
        });*/


        return {
            successEth: true,
            statusEth: "Done minting Ethereum token... Minting polygon token...",
            txHash: txHash,
        }

    } catch (error) {
        console.log("ERROR! =>", error)
        return {
            successEth: false,
            statusEth: "😥 Something went wrong: " + error.message
       }    
    }


    
}



