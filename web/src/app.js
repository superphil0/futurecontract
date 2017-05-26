var async = require('async');
var Web3 = require('web3');
var ethTx = require('ethereumjs-tx');
var SolidityFunction = require('web3/lib/web3/function');

var abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "price",
        "type": "uint256"
      },
      {
        "name": "exercise_date",
        "type": "uint256"
      }
    ],
    "name": "makeOffer",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "offerId",
        "type": "uint256"
      }
    ],
    "name": "makeBid",
    "outputs": [],
    "type": "function"
  }
];

var sandboxId = '35df6eb0cb';
var url = 'https://rgndws.by.ether.camp:8555/sandbox/' + sandboxId;
var web3 = new Web3(new Web3.providers.HttpProvider(url));

web3.eth.defaultAccount = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';

var contract = web3.eth.contract(abi).at('0x17956ba5f4291844bc25aedb27e69bc11b5bda39');

$(function() {
  $('#makeOffer').click(function(e) {
    e.preventDefault();
    
    async.parallel({
      nonce: web3.eth.getTransactionCount.bind(web3.eth, web3.eth.defaultAccount),
      gasPrice: web3.eth.getGasPrice.bind(web3.eth)
    }, function(err, results) {
      if (err) return console.error(err);
    
      var func = new SolidityFunction(web3, abi[0], '');
      var data = func.toPayload([parseInt($('#amount').val()), new Date($('#exercise_date')).getTime() / 1000, parseInt($('#price').val())])
      console.log(data);
      data = data.data;
      
      var tx = new ethTx({
        to: contract.address,
        nonce: results.nonce,
        gasLimit: '0x100000',
        gasPrice: '0x' + results.gasPrice.toString(16),
        data: data
      });
      console.log(data)
      //console.log([$('#amount').val(), new Date($('#amount').val()).getTime() / 1000 + "", $('#price').val()])
      tx.sign(new Buffer('974f963ee4571e86e5f9bc3b493e453db9c15e5bd19829a4ef9a790de0da0015', 'hex'));
   
      web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function(err, txHash) {
        if (err) return console.error(err);
        
        var blockFilter = web3.eth.filter('latest');
        blockFilter.watch(function() {
          web3.eth.getTransactionReceipt(txHash, function(err, receipt) {
            if (err) return console.error(err);
            if (receipt) {
              blockFilter.stopWatching();
              console.log(receipt);
            }
          });
        });
      });
    });
  });
  $('#makeBid').click(function(e) {
    e.preventDefault();
    
    async.parallel({
      nonce: web3.eth.getTransactionCount.bind(web3.eth, web3.eth.defaultAccount),
      gasPrice: web3.eth.getGasPrice.bind(web3.eth)
    }, function(err, results) {
      if (err) return console.error(err);
    
      var func = new SolidityFunction(web3, abi[1], '');
      var data = func.toPayload([$('#offerId').val()]).data;
      
      var tx = new ethTx({
        to: contract.address,
        nonce: results.nonce,
        gasLimit: '0x100000',
        gasPrice: '0x' + results.gasPrice.toString(16),
        data: data
      });
      tx.sign(new Buffer('974f963ee4571e86e5f9bc3b493e453db9c15e5bd19829a4ef9a790de0da0015', 'hex'));
      
      web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function(err, txHash) {
        if (err) return console.error(err);
        
        var blockFilter = web3.eth.filter('latest');
        blockFilter.watch(function() {
          web3.eth.getTransactionReceipt(txHash, function(err, receipt) {
            if (err) return console.error(err);
            if (receipt) {
              blockFilter.stopWatching();
              console.log(receipt);
            }
          });
        });
      });
    });
  });
});
