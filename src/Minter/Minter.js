import { useState } from "react";
import { useNavigate } from "react-router-dom" 

import { mintEth } from "../utils/mintEth";
import { mintPolygon } from "../utils/mintPolygon";
import { butcherNft } from "../utils/butcher"
import { fetchImage, processImage } from "../utils/retrieveMetadata";

const Minter = ({walletAddress, img, imgBlob, metadata, tokenContract, tokenId, chain}) => {
  const [status, setStatus] = useState('');
  const [title, setTitle] = useState('starting!');
  const [choppedImage, setChoppedImage] = useState('')
  //State variables
  let navigate = useNavigate(); 

  let royaltyHolder, royaltyAmount, conditionalAddress;

  conditionalAddress = chain == "Solana" ? <h2>Address: {tokenContract} </h2> : <h2>Contract {tokenContract} <br/> Token ID: {tokenId} </h2>
  
  royaltyHolder = metadata[0].royaltyHolder != "" ? <h2> Royalty Holder: {metadata[0].royaltyHolder} </h2>: <h2>Royalty Holder: None identified </h2>;
  royaltyAmount = metadata[0].royaltyAmount != null ? <h2> Royalty Amount: {metadata[0].royaltyAmount} </h2>: <h2>Royalty Amount: None identified </h2>;

  const onMintPressed = async () => {
    const status = "Butchering image and creating metadata. This may take up to a minute."
    setStatus(status)
    const { success, butcherStatus, data } = await butcherNft(walletAddress, imgBlob, metadata, tokenContract, tokenId, chain);
    metadata = [data];
    URL.revokeObjectURL(imgBlob);
    if (success){
      setStatus(butcherStatus)
    } else {
      status = "Something went wrong! " + status;
      navigate("/import");
    }

    const { successEth, statusEth, txHash } = await mintEth(walletAddress, data);
    metadata[0].ethTxHash = txHash;

    if (successEth){
      setStatus(statusEth)
    } else {
      status = "Something went wrong! " + statusEth;
      navigate("/import");
    }


    const { successPoly, statusPoly, polygonTokenId } = await mintPolygon(data);
    metadata[0].polygonTokenId = polygonTokenId

    if (successPoly){
      setStatus(statusPoly)
    } else {
      status = "Something went wrong! " + statusPoly + "Polygon mint failed. However, we've already minted the Ethereum token, so all is good there... Redirecting...";
    }
    console.log(metadata);
    console.log("image manipulation");
    let hash = metadata[0].ipfsImage.split(/[/]+/).pop();   
    console.log("HASH =>", hash) 
    let normalisedImage = "https://butcher.infura-ipfs.io/ipfs/" + hash
    let localImage = await fetchImage(normalisedImage);
    console.log("LOCAL IMAGE =>", localImage)
    if(localImage == undefined || localImage == null){
      console.log("imageError");
    } 
    let imageObjectUrl = URL.createObjectURL(localImage);
    console.log("IMAGE OBJECTURL =>", imageObjectUrl);

    setTitle('Butchered!')
    setChoppedImage(imageObjectUrl);
  
  };

  return (
    <div className="Minter">
      <br></br>
      {title}
      <img src={choppedImage} />      
      <img src={img} />
      <h2 id="status">
        {status}
      </h2>
      <br></br>
      <h1 id="title">On the chopping block:</h1>
      {conditionalAddress}
      <h2>Name: {metadata[0].nftName}</h2>
      <h2>Owner: {metadata[0].owner}</h2>
      {royaltyHolder}
      {royaltyAmount}

      <button id='mintButton' onClick={onMintPressed}>Mint NFT</button>




      

    </div>
  );
};

export default Minter;

