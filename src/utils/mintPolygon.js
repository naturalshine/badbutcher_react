const axios = require('axios');

require('dotenv').config();


export const mintPolygon = async(data, ethTokenId) => {
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
            successPoly: true,
            statusPoly: "Minting complete",
            polygonTokenId: polygonMint.polygonTokenId,
        }

    } catch (error) {
        return {
            successPoly: false,
            statusPoly: "😥 Something went wrong: " + error.message
       }    
    }


    
}



