App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,

    init: function () {
        //loads all beers owned

        var beerRow = $('#beerRow');
        var beerTemplate = $('#beerTemplate');


        beerTemplate.find(".panel-title").text('Beer 1');
        beerTemplate.find(".article-description").text('Ceres');
        beerTemplate.find(".article-price").text('1');
        beerTemplate.find(".article-seller").text('0x12312321');

        beerRow.append(beerTemplate.html());

        return App.initWeb3();
    },

    initWeb3: function () {
        //web3 can be injected into browser by extensions, like metamask
        if (typeof web3 != 'undefined') {
            console.log("Resuing provider: " + web3);
            App.web3Provider = web3.currentProvider;
        } else {
            //connect to local ganache
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
        web3.eth.getCoinbase(function (err, account) {
                if (err === null) {
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
        )
    },

    reloadBeerList() {
        return undefined;
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
