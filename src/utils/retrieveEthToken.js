
const axios = require('axios');

require('dotenv').config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../abis/contract-abi.json');
const contractAddress = process.env.REACT_APP_CONTRACT;


export const retrieveEthToken = async(txHash, id) => {
    try{

        let ethTokenId;
        const transactionReceipt = await web3.eth.getTransactionReceipt(txHash).then(function(data){
            console.log("DATA => ", data);
            ethTokenId = web3.utils.hexToNumber(data.logs[0].topics[3]);
            console.log("DELAYED TOKEN ID => ", ethTokenId)
        });

        // login to get jwt
        const login = await axios.post(process.env.REACT_APP_BUTCHER_LOGIN, {"username": process.env.REACT_APP_JWT_USER, "password": process.env.REACT_APP_JWT_PASSWORD}, 
            { headers: { 'Content-Type': 'application/json' } } )
        
        const jwt = login.data.jwt

        //post token to database
        const ethObj = {'ethTokenId': ethTokenId}

        await axios.post(process.env.REACT_APP_BUTCHER_API + '/api/slaughtered/' + id, ethObj, {
            headers: {
                'authorization' : 'Bearer ' + jwt,
                'Content-Type' : 'application/json'
            }
        }) ;

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



