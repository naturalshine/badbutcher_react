import { useEffect, useState } from "react";
//import { retrieveMetadata} from "../utils/retrieveMetadata.js";

import { fetchImage, processImage } from "../utils/retrieveMetadata";

const Butcher = ({status, metadata, walletAddress, img}) => {
    const [butcheredImage, setButcheredImage] = useState('');
    const useData = metadata[0]

    const prepareDisplay = async () => { 
      try{
          console.log("IPFS IMAGE =>", useData.ipfsImage)
          const imgUrl = await processImage(useData.ipfsImage);
          let localImage = await fetchImage(imgUrl);
          if(localImage == undefined || localImage == null){
            throw "imageError";
          } 
          const imageObjectURL = URL.createObjectURL(localImage);
          const butcheredImage = imageObjectURL;
          setButcheredImage(butcheredImage);
        } catch(error){
          status = "Sorry, something went wrong. Please reconnect your wallet and refresh."
        }
    }
    
    useEffect(async () => {
      await prepareDisplay();
    });  

    return (
        <div className="Butcher">
        <img src={img} />
        <img src={butcheredImage} />


        <p id="metadata">
          {useData}
        </p>
        </div>
      );

};

export default Butcher;