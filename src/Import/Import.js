//import { useState } from "react";

const Import = ({ tokenContract, handleTokenContract, tokenId, handleTokenId, chain, handleChain, handleSubmit })  => {
  let tokenContractLabel;
  let tokenIdLabel;
  let tokenIdField;

  if (chain == "Solana"){
    tokenContractLabel = <h2>Token Address</h2>
    tokenIdLabel = "";
    tokenIdField = "";
  }else{
    tokenContractLabel = <h2>Token Contract: </h2>
    tokenIdLabel =  <h2>Token ID: </h2>
    tokenIdField =  <input
                      type="text"
                      placeholder="42"
                      value={tokenId}
                      onChange={handleTokenId}
                    />;
  }
    
  return (
      <div className="Butcher">
      <h1 id="title">🧙‍♂️ Fetch yr contract data</h1>
      <p>
        Simply add your contract's address and the token id of the NFT you want to butcher...
      </p>
      <form>
      <h2>Chain:</h2>
        <select value={chain} onChange={handleChain}>
          <option value="Ethereum">Ethereum</option>
          <option value="Polygon">Polygon</option>
          <option value="Solana">Solana</option>
          <option value="BSC">BSC</option>
          <option value="Avalance">Avalanche</option>
          <option value="Fantom">Fantom</option>
          <option value="Palm">Palm</option>
          <option value="Cronos">Cronos</option>
          <option value="Arbitum">Arbitum</option>
        </select>
      
        {tokenContractLabel}
        <input
          type="text"
          placeholder="0xkjdflksjdlfkjsdlf"
          value={tokenContract}
          onChange={handleTokenContract}
        />

        {tokenIdLabel}

        {tokenIdField}

      </form>
      <button id="metadataButton" onClick={handleSubmit}>
        Fetch NFT
      </button>

      </div>
    );

};

export default Import;