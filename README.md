## TODO

### Auction
- how to set sales time & price & c? 

### AR WEAVE CLI: https://github.com/ardriveapp/ardrive-cli
	- This can be invoked via python scripts ?? after image processing. Still don't get how URLs work/are returned. But then that would be pushed to the smart contract. 
	- How to make sure that ARweave wallet keeps enough AR tokens? Just overfund to begin with? Would need to have a check that returns an error message -- this is part of semi complicated python-react workflow

### OPTIMISM
	- Figure out how this is being used -- does it make sense? Or just deploy to mainnet? Something I can ask Billy about because of Paul's thing on optimism
	- Might cut down costs but like -- can NFTs on optimism be easily ported to other networks? 

### ROYALTIES & C. 
- Inherit OZ royalty contract 
- Update metadata to reflect: 
	- original artist and royalty %
	- original token url / contracts / uri 
- Can I fetch artwork/etc. simply via token URI function of erc 721 contracts instead of querying opensea api? 

### Webapp
- Royalty database --> query in dapp or in contract? 

### DEPLOYMENT
- persistant react server -- with docker? 
