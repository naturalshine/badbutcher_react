import { useState } from "react";
import { mintNFT } from "../utils/interact.js";

const Minter = ({img, imgBlob, metadata, tokenContract, tokenId, chain}) => {
  console.log(img);
  console.log("^image");
  //State variables
  const [status, setStatus] = useState("");



  let royaltyHolder, royaltyAmount, conditionalAddress;

  conditionalAddress = chain == "Solana" ? <h2>Address: {tokenContract} </h2> : <h2>Contract {tokenContract} <br/> Token ID: {tokenId} </h2>
  
  royaltyHolder = metadata[0].royaltyHolder != "" ? <h2> Royalty Holder: {metadata[0].royaltyHolder} </h2>: <h2>Royalty Holder: None identified </h2>;
  royaltyAmount = metadata[0].royaltyAmount != null ? <h2> Royalty Amount: {metadata[0].royaltyAmount} </h2>: <h2>Royalty Amount: None identified </h2>;

  const onMintPressed = async () => {
    const { status } = await mintNFT(imgBlob, metadata, tokenContract, tokenId, chain);
    setStatus(status);
  };

  return (
    <div className="Minter">
      <br></br>

      <img src={img} />
      
      <br></br>
      <h1 id="title">On the chopping block:</h1>
      {conditionalAddress}
      <h2>Name: {metadata[0].nftName}</h2>
      <h2>Owner: {metadata[0].owner}</h2>
      {royaltyHolder}
      {royaltyAmount}


      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;

