const BeerList = artifacts.require("./BeerList.sol");

module.exports = function (deployer) {
    deployer.deploy(BeerList);
}
