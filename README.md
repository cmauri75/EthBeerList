# EthBeerList
Store application for decentralized beer bottle market based on ethereum network

## Startin' up

* BeerList.sol:
Manages selling of beers
  
* 2_deploy_contracts.js:
manages deployment of contracts
  
Decided to use ganache for testing as specified in truffle.js
```
truffle migrate --compile-all --reset --network ganache
```

Connect to ganache and check contract address and balance on account0 (deployer), I paied gas to deploy contract.
```
truffle console --network ganache
BeerList.address
web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]),"ether").toNumber()
```

Now interact with deployed contact. Account[1] sells a beer (so pays gas for it)
```
BeerList.deployed().then(function(instance) {app=instance});
app
app.getBeer()
app.sellBeer("0x00123","Ceres",web3.toWei(1.23,"ether"),{from:web3.eth.accounts[1]})
web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]),"ether").toNumber()
.exit
```

Now create test for our contract (very important) BeerListHappyPath
```
truffle test --network ganache
```

## Frontend
Start the server serving a simple jquery+bootstrap webapp.
App is created "by hand" webpack should be a better choice 
```
npm install
npm run dev
```
