// SPDX-License-Identifier: MIT
//Declare the version of solidity to compile this contract. 
//This must match the version of solidity in your hardhat.config.js file
pragma solidity ^0.8.2;
 
//inherits three OpenZepplin smart contract classes
 
//contains implementation of ERC721
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
 
//provides counters that can only be incremented or decremented by one
import "@openzeppelin/contracts/utils/Counters.sol";
 
//implements ownership in the contracts
import "@openzeppelin/contracts/access/Ownable.sol";

// implements Royalty interface
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";


//This function instantiates the contract and 
//classifies ERC721 for storage schema
contract BadButcher is ERC721URIStorage, Ownable {
 
    //to keep track of the total number of NFTs minted 
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
 
    //sets contract's name and symbol
    constructor() ERC721("BadButcher", "BUTCH") {}
 
    //address recipient: address that will receive freshly minted NFT
    //tokenURI: describes the NFT's metadata
    function mintNFT(address recipient, string memory tokenURI)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
 
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    /*
    function mintNFTWithRoyalty(address recipient, string memory tokenURI, address royaltyReceiver, uint96 feeNumerator)
        public onlyOwner
        returns (uint256) 
    {
        uint256 tokenId = mintNFT(recipient, tokenURI);
         _setTokenRoyalty(tokenId, royaltyReceiver, feeNumerator);

        return tokenId;
    }
    */
}