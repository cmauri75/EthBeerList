pragma solidity ^0.4.18;

contract BeerList {
    address seller;

    string bottleID;
    string name;
    uint256 price;

    //Sells a beer
    function sellBeer(string _bottleID, string _name, uint256 _price) public {
        seller = msg.sender;

        bottleID = _bottleID;
        name = _name;
        price = _price;
    }

    //Returns the sold article
    function getArticle() public view returns (address _seller, string _bottleID, string _name, uint256 _price){
        return (seller, bottleID, name, price);
    }

    constructor() public {

    }
}
