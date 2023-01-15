import {React, useState, useEffect} from "react";
import {Routes , Route, Link, useNavigate } from "react-router-dom" 

import './App.css';

import Butcher from "./Butcher/Butcher" 
import Gallery from "./Gallery/Gallery" 
import Import from "./Import/Import"
import Minter from "./Minter/Minter"
import Audio from "./Audio/Audio"
import Home from "./Home/Home"

import { retrieveMetadata, fetchImage } from "./utils/retrieveMetadata.js";
import { connectWallet, getCurrentWalletConnected } from "./utils/handleWallet.js"

function App() {
  const [metadata, setMetadata] = useState('');
  
  const [tokenContract, setTokenContract] = useState('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d');
  const [tokenId, setTokenId] = useState('101');
  const [chain, setChain] = useState('Ethereum');
  const [img, setImg] = useState('');
  const [imgBlob, setImgBlob] = useState('');

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  let errorMessage;

  let navigate = useNavigate(); 

  // wallet handling...

  useEffect(async () => {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status)

    addWalletListener(); 

  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          navigate("/import");
        } else {
          setWallet("");
          setStatus(<h1>You must be connected to a wallet to proceed.</h1>);
          navigate("/");
        }
      });
    } else {
      setStatus(
        <h1>
          🦊
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must be connected to the Ethereum network to continue. One way to do this is to install Metamask, a virtual Ethereum wallet, in your
            browser. 
          </a>
        </h1>
      );
    }
  }

  // nft submission handling...

  const handleSubmit = async event => {
    try{
      let { success, message, metadata } = await retrieveMetadata(tokenContract, tokenId, chain);

      if(success){

        setMetadata(metadata);
        
        try{
          console.log(metadata[0].image)
          let localImage = await fetchImage(metadata[0].image);
          if(localImage == undefined || localImage == null){
            throw "imageError";
          } 
          setImgBlob(localImage)
          const imageObjectURL = URL.createObjectURL(localImage);
          console.log(imageObjectURL);
          setImg(imageObjectURL);
          console.log(img);
          navigate("/mint");
        } catch (error) {
          errorMessage =  <h3> Sorry: we can't fetch this NFT! Try a different NFT.</h3>;
        }
      

      } else {
        errorMessage =  <h3> Sorry: we can't fetch this NFT! Try a different NFT.</h3>
      }
    } catch (error){
      console.log(error);
      errorMessage = <h3> Sorry: we can't fetch this NFT! Try a different NFT.</h3>
    }

  }

  const handleTokenContract = event => {
    setTokenContract(event.target.value);
  };

  const handleTokenId = event => {
    setTokenId(event.target.value);
  };
  
  const handleChain = event => {
    setChain(event.target.value);
  }

  return (
    <div className="App">
        <nav> 
            <Link to ="/"> Butcher </Link> || 
            <Link to ="/gallery"> Gallery </Link> ||
            <Link to ="/audio"> Audio </Link> 
       </nav> 

       <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

       {errorMessage}

       {status}

        <Routes> 
            <Route path="/" element={<Home />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/import" element={<Import tokenContract={tokenContract} handleTokenContract={handleTokenContract} tokenId={tokenId} handleTokenId={handleTokenId} chain={chain} handleChain={handleChain} handleSubmit={handleSubmit}/>}></Route>
            <Route path="/mint" element={<Minter walletAddress={walletAddress} img={img} imgBlob={imgBlob} metadata={metadata} tokenContract={tokenContract} tokenId = {tokenId} chain={chain} />}></Route>
            <Route path="/butcher" element={<Butcher />}></Route>
            <Route path="/gallery" element={<Gallery />}></Route>
            <Route path="/audio" element={<Audio/>}></Route>
       </Routes>     

    </div>
  );
}

export default App;
