import { useState } from "react";
import { mintEth } from "../utils/mintEth";
import { mintPolygon } from "../utils/mintPolygon";
import { butcherNft } from "../utils/butcher"
import { useNavigate } from "react-router-dom" 

const Minter = ({walletAddress, img, imgBlob, metadata, tokenContract, tokenId, chain}) => {

  //State variables
  const [status, setStatus] = useState("");
  let navigate = useNavigate(); 

  let royaltyHolder, royaltyAmount, conditionalAddress;

  conditionalAddress = chain == "Solana" ? <h2>Address: {tokenContract} </h2> : <h2>Contract {tokenContract} <br/> Token ID: {tokenId} </h2>
  
  royaltyHolder = metadata[0].royaltyHolder != "" ? <h2> Royalty Holder: {metadata[0].royaltyHolder} </h2>: <h2>Royalty Holder: None identified </h2>;
  royaltyAmount = metadata[0].royaltyAmount != null ? <h2> Royalty Amount: {metadata[0].royaltyAmount} </h2>: <h2>Royalty Amount: None identified </h2>;

  const onMintPressed = async () => {
    status = "Butchering image and creating metadata. This may take up to a minute."
    setStatus(status);
    const { success, status, data } = await butcherNft(walletAddress, imgBlob, metadata, tokenContract, tokenId, chain);
    URL.revokeObjectURL(imgBlob);
    if (success){
      setStatus(status);
    } else {
      setStatus("Something went wrong! " + status);
      navigate("/import");
    }

    const { successEth, statusEth, mintEthData } = await mintEth(walletAddress, data);

    if (successEth){
      setStatus(statusEth);
    } else {
      setStatus("Something went wrong! " + statusEth);
      navigate("/import");
    }

    const { successPoly, statusPoly, mintPolyData } = await mintPolygon(walletAddress, data, mintEthData);

    if (successPoly){
      setStatus(statusPoly);
      navigate("/butchered");
    } else {
      setStatus("Something went wrong! " + statusPoly);
      navigate("/import");
    }
    
  };

  return (
    <div className="Minter">
      <br></br>

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


      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>

    </div>
  );
};

export default Minter;

