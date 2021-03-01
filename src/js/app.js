App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,

    init: function () {
        //loads all beers owned
        return App.initWeb3();
    },

    printBeerRow: function (id, name, price, seller) {
        var beerRow = $('#beerRow');
        var beerTemplate = $('#beerTemplate');

        if (seller === App.account) {
            seller = "You";
        }

        beerTemplate.find(".panel-title").text("Beer id: " + id);
        beerTemplate.find(".article-description").text(name);
        beerTemplate.find(".article-price").text(price);
        beerTemplate.find(".article-seller").text(seller);

        beerRow.append(beerTemplate.html());
    },

    initWeb3: function () {
        // initialize web3
        if(typeof web3 !== 'undefined') {
            console.log("Browser is connected to metamask, use provider for getting accounts");
            //reuse the provider of the Web3 object injected by Metamask, accounts are connected to ganache, now I can choose mine
            App.web3Provider = window.ethereum; // old: web3.currentProvider;
        } else {
            console.log("no providers found, connect to ganache")
            //create a new provider and plug it directly into our local node. Account used is coinbase
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        web3 = new Web3(App.web3Provider);

        App.displayAccountInfo();

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('BeerList.json', function (beerListArtifact) {
            //get the beer list artifact and use to instatiate a truffle contract abstraction
            App.contracts.BeerList = TruffleContract(beerListArtifact);
            //set the provider for contract
            App.contracts.BeerList.setProvider(App.web3Provider);
            //retreive the beers from contract
            return App.reloadBeerList();

        })
    },

    displayAccountInfo() {
        //deprecated
        //ethereum.enable();

        ethereum.request({
            method: 'eth_requestAccounts'
        }).then(function (res) {
            account = res[0];

            console.log("Got account: "+account);
            App.account = account;
            $('#account').text(account);
            web3.eth.getBalance(account, function (err, balance) {
                    if (err === null) {
                        $('#accountBalance').text(web3.fromWei(balance, 'ether') + " ETH");
                    }
                }
            )
        });


        /**
         * NEw version, to be completed, should work with new eth too
        function getAccounts(callback) {
            web3.eth.getAccounts((error,result) => {
                if (error) {
                    console.log(error);
                } else {
                    callback(result);
                }
            });
        }
        getAccounts(function(result) {
            console.log("--->"+result);
        });
        **/

        /*
        //Old version
        web3.eth.getCoinbase(function (err, account) {
                if (err === null) {
                    console.log("Got coinbase: "+account);
                    App.account = account;
                    $('#account').text(account);
                    web3.eth.getBalance(account, function (err, balance) {
                            if (err === null) {
                                $('#accountBalance').text(web3.fromWei(balance, 'ether') + " ETH");
                            }
                        }
                    )
                }
            }
        ) */
    },

    reloadBeerList() {
        // refresh account balances and address
        App.displayAccountInfo();
        //retreive beer placeholders and clear it
        $('#beerRow').empty();

        App.contracts.BeerList.deployed().then(function (instance) {
            var res =  instance.getBeer();
            return res;
        }).then(function (beer) {
            if (beer[0] == 0x0) {
                //no beer to display
                return
            }
            App.printBeerRow(beer[1], beer[2], web3.fromWei(beer[3], 'ether'), beer[0]);
        }).catch(function (err) {
            console.log("error retreiving sold beers");
            console.log(err);
        })
    },

    sellBeer() {
        var _beer_id = $('#beer_id').val();
        var _beer_price = web3.toWei(parseFloat($('#beer_price').val() || 0), 'ether');
        var _beer_name = $('#beer_name').val();

        if (_beer_name.trim() == '' || _beer_price == 0) {
            return false;
        }

        //If using metamask it will intercept transaction and allow parameters chages
        App.contracts.BeerList.deployed().then(function (instance) {
            return instance.sellBeer(_beer_id, _beer_name, _beer_price, {
                from: App.account,
                gas: 500000
            }).then(function (result) {
                App.reloadBeerList();
            }).catch(function (err) {
                console.log(err);
            })
        })
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
