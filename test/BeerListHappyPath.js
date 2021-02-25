const BeerList = artifacts.require("./BeerList.sol");

//test suite entry point
//Pass the contract, it promises passing all accounts in blockchain
contract(BeerList, function (accounts) {
    var beerListInstance;
    var seller = accounts[1];
    var bottleId = "CerID89";
    var beerName = "Ceres";
    var beerPrice = 5;

    it("Should be initialized with empty values", function () {
        return BeerList.deployed().then(function (instance) {
            return instance.getArticle();
        }).then(function (data) {
            assert.equal(data[0], 0x0, "Seller must be empty");
            assert.equal(data[1], "", "Bottle id must be empty");
            assert.equal(data[2], "", "Beer name must be empty");
            assert.equal(data[3].toNumber(), 0, "Beer price must be zero");
        })
    });

    it("Should sell a beer", function () {
        return BeerList.deployed().then(function (instance) {
            beerListInstance = instance;
            return beerListInstance.sellBeer(bottleId, beerName, web3.toWei(beerPrice, "ether"), {from: web3.eth.accounts[1]})
        }).then(function () {
            return beerListInstance.getArticle();
        }).then(function (data) {
            assert.equal(data[0], seller, "Seller must be seller id");
            assert.equal(data[1], bottleId, "Bottle id must be correct");
            assert.equal(data[2], beerName, "Beer name must be correct");
            assert.equal(data[3].toNumber(), web3.toWei(beerPrice, "ether"), "Beer price must be fair");
        })
    })
});