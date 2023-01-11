import { useEffect, useState } from "react";
//import { retrieveMetadata} from "../utils/retrieveMetadata.js";

const Butcher = (props) => {
    const [metadata, setMetadata] = useState("");
    const [tokenContract, setTokenContract] = useState("");
    const [tokenId, setTokenId] = useState("");

    const onContractData = async () => {
      console.log(tokenContract);
      //const { metadata } = await retrieveMetadata(tokenContract, tokenId);
      //setMetadata(metadata);
      //navigate("/mint");
  };
  
    return (
        <div className="Butcher">
        <h1 id="title">🧙‍♂️ Fetch yr contract data</h1>
        <p>
          Simply add your contract's address and the token id of the NFT you want to butcher...
        </p>
        <form>
          <h2>🖼 contract address: </h2>
          <input
            type="text"
            placeholder="0xkjdflksjdlfkjsdlf"
            onChange={(event) => setTokenContract(event.target.value)}
          />
          <h2>🤔 token id: </h2>
          <input
            type="text"
            placeholder="42"
            onChange={(event) => setTokenId(event.target.value)}
          />
  
        </form>
        <button id="metadataButton" onClick={onContractData}>
          Retrieve NFT info
        </button>
        <p id="metadata">
          {metadata}
        </p>
        </div>
      );

};

export default Butcher;