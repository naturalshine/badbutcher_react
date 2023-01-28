const axios = require('axios');

require('dotenv').config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const contractAddress = "0x0eEF58876195d36b3D4b71Df19c5ABAe5B69deE9";


export const mintPolygon = async(walletAddress, data, ethTokenId) => {
    try{

        // login to get jwt
        const login = await axios.post(process.env.REACT_APP_BUTCHER_LOGIN, {"username": process.env.REACT_APP_JWT_USER, "password": process.env.REACT_APP_JWT_PASSWORD}, 
            { headers: { 'Content-Type': 'application/json' } } )
        
        const jwt = login.data.jwt

        // mint polygon
        let polygonMint;
        const polyData = {}
        polyData.id = data.id;
        polyData.ethTokenId = ethTokenId;

        polygonMint = await axios.post(process.env.REACT_APP_BUTCHER_API + '/mint', polyData, {
            headers: {
                'authorization' : 'Bearer ' + jwt,
                'Content-Type' : 'application/json'
            }
        }) ;

        return {
            success: true,
            status: "Minting complete",
            polygonTokenId: polygonMint.polygonTokenId,
        }

    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
       }    
    }


    
}



