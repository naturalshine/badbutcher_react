const axios = require('axios');

require('dotenv').config();


export const butcherNft = async(walletAddress, imgBlob, metadata, tokenContract, tokenId, chain) => {

    function blobToBase64(blob) {
        return new Promise((resolve, _) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

    //make metadata
    try{
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
        
        let imgReturn, imgToSend, nft;    

        imgToSend = await blobToBase64(imgBlob);

        let data = {"image": imgToSend}
        imgReturn = await axios.post(process.env.REACT_APP_BUTCHER_API + '/upload', data, {
            headers: {
                'authorization' : 'Bearer ' + jwt,
                'Content-Type' : 'application/json'
            }
        }) 
        
        nft = await axios.post(process.env.REACT_APP_BUTCHER_API + '/butcher', 
            {"metadata": [butcheredMetadata], "butcherId": imgReturn.data.id }, 
            { headers: { 'Content-Type': 'application/json', 'authorization' : 'Bearer ' + jwt } 
        });
                
        return {
            success: true,
            status: "NFT butchered. Minting tokens.",
            data: nft.data,
        }

    } catch(error){
        return {
            success: false,
            butcherStatus: "😥 Something went wrong: " + error.message
        }    
    }
        
}



