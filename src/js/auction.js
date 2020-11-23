// App = {
//   web3Provider: null,
//   contracts: {},

//   init: async function() {

//     return await App.initWeb3();
//   },

//   initWeb3: async function() {
//     // Modern dapp browsers...
//     if (window.ethereum) {
//       App.web3Provider = window.ethereum;
//       try {
//         // Request account access
//         await window.ethereum.enable();
//       } catch (error) {
//         // User denied account access...
//         console.error("User denied account access")
//       }
//     }
//     // Legacy dapp browsers...
//     else if (window.web3) {
//       App.web3Provider = window.web3.currentProvider;
//     }
//     // If no injected web3 instance is detected, fall back to Ganache
//     else {
//       App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
//     }
//     web3 = new Web3(App.web3Provider);

//     return App.initContract();
//   },

//   initContract: function() {
//     $.getJSON('MyAuction.json', function(data)) {
//       var MyAuctionArtifact = data;
//       App.contracts.MyAuction = TruffleContract(MyAuctionArtifact);

//       App.contracts.MyAuction.setProvider(App.web3Provider);
//       // TODO:
//       // return
//     }
//   }
// };

// $(function() {
//   $(window).load(function() {
//     App.init();
//   });
// });

var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider("http://localhost:7545"));
var bidder = web3.eth.accounts[0];
web3.eth.defaultAccount = bidder;
var auctionContract = web3.eth.contract([{ "constant": true, "inputs": [], "name": "MyCar", "outputs": [{ "name": "Brand", "type": "string" }, { "name": "Rnumber", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "get_owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "bid", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "cancel_auction", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "bids", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "auction_start", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "highestBidder", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "destruct_auction", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "auction_end", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "STATE", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "highestBid", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_biddingTime", "type": "uint256" }, { "name": "_owner", "type": "address" }, { "name": "_brand", "type": "string" }, { "name": "_Rnumber", "type": "string" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": false, "stateMutability": "nonpayable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "highestBidder", "type": "address" }, { "indexed": false, "name": "highestBid", "type": "uint256" }], "name": "BidEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "withdrawer", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "WithdrawalEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "message", "type": "string" }, { "indexed": false, "name": "time", "type": "uint256" }], "name": "CanceledEvent", "type": "event" }]);
var contractAddress = "0xAbc586Ea38B3d0707b0c2C6BE3544Fc9Bc9E796F";
var auction = auctionContract.at(contractAddress);

function bid() {
  var mybid = document.getElementById('value').value;
  // Automatically determines the use of call or sendTransaction based on the method type
  auction.bid({ value: web3.toWei(mybid, "ether"), gas: 200000 }, function (error, result) {
    if (error) {
      console.log("error is " + error);
      document.getElementById("biding_status").innerHTML = "Think to bidding higher";
    }
    if (!error)
      document.getElementById("biding_status").innerHTML = "Successfull bid, transaction ID:" + result;
  });

}

function init() {

  auction.auction_end(function (error, result) {
    document.getElementById("auction_end").innerHTML = result;
  });

  auction.highestBidder(function (error, result) {
    document.getElementById("HighestBidder").innerHTML = result;
  });

  auction.highestBid(function (error, result) {
    var bidEther = web3.fromWei(result, 'ether');
    document.getElementById("HighestBid").innerHTML = bidEther;

  });
  auction.STATE(function (error, result) {
    document.getElementById("STATE").innerHTML = result;

  });

  auction.MyCar(function (error, result) {
    document.getElementById("car_brand").innerHTML = result[0];
    document.getElementById("registration_number").innerHTML = result[1];

  });

  auction.bids(bidder, function (error, result) {
    var bidEther = web3.fromWei(result, 'ether');
    document.getElementById("MyBid").innerHTML = bidEther;

    console.log(bidder);
  });
}

var auction_owner = null;
auction.get_owner(function (error, result) {
  if (!error) {
    auction_owner = result;
    if (bidder != auction_owner)
      $("#auction_owner_operations").hide();
  }

});


function cancel_auction() {
  auction.cancel_auction(function (error, result) {
    console.log(error);
  });
}

function Destruct_auction() {
  auction.destruct_auction(function (error, result) {
    console.log(result);
  });
}

/*filter.get(callback): Returns all of the log entries that fit the filter.
filter.watch(callback): Watches for state changes that fit the filter and calls the callback. See this note for details.*/
var BidEvent = auction.BidEvent(); // var BidEvent = auction.BidEvent(({}, {fromBlock: 0, toBlock: 'latest'});


BidEvent.watch(function (error, result) {
  if (!error) {
    $("#eventslog").html(result.args.highestBidder + ' has bidden(' + result.args.highestBid + ' wei)');
  } else {

    console.log(error);
  }
});

var CanceledEvent = auction.CanceledEvent();

CanceledEvent.watch(function (error, result) {
  if (!error) {
    console.log(result);

    $("#eventslog").html(result.args.message + ' at ' + result.args.time);
  } else {

    console.log(error);
  }
});


const filter = web3.eth.filter({
  fromBlock: 0,
  toBlock: 'latest',
  address: contractAddress,
  topics: [web3.sha3('BidEvent(address,uint256)')]
})

filter.get((error, result) => {
  if (!error)
    console.log(result);
  //console.log(result[0].data);

})
