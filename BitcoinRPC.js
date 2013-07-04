// BitcoinRPC.js
// MIT/X11-like license.  See LICENSE.txt.
// Copyright 2013 BitPay, Inc.
require('classtool');

function ClassSpec(b) {
  var http = b.http || require('http');
  var https = b.https || require('https');

  function BitcoinRPC(opts) {
    opts = opts || {};
    this.host = opts.host || '127.0.0.1';
    this.port = opts.port || 8332;
    this.user = opts.user || 'user';
    this.pass = opts.pass || 'pass';
    this.protocol = (opts.protocol == 'http') ? http : https;
  }

  BitcoinRPC.prototype.getInfo = function(callback) {
    RPC.call(this, 'getinfo', null, callback);
  };

  BitcoinRPC.prototype.getNewAddress = function(account, callback) {
    RPC.call(this, 'getnewaddress', [account], callback);
  };

  BitcoinRPC.prototype.getAddressesByAccount = function(account, callback) {
    RPC.call(this, 'getaddressesbyaccount', [account], callback);
  };

  BitcoinRPC.prototype.getBalance = function(account, minconf, callback) {
    RPC.call(this, 'getbalance', [account, minconf ? minconf : 1], callback);
  };

  BitcoinRPC.prototype.getDifficulty = function(callback) {
    RPC.call(this, 'getdifficulty', [], callback);
  };

  BitcoinRPC.prototype.listAccounts = function(minconf, callback) {
    RPC.call(this, 'listaccounts', [minconf ? minconf : 1], callback);
  };

  BitcoinRPC.prototype.listReceivedByAccount = function(minconf, includeEmpty, callback) {
    RPC.call(this, 'listreceivedbyaccount', [minconf ? minconf : 1, includeEmpty], callback);
  };

  BitcoinRPC.prototype.listReceivedByAddress = function(minconf, includeEmpty, callback) {
    RPC.call(this, 'listreceivedbyaddress', [minconf ? minconf : 1, includeEmpty], callback);
  };

  BitcoinRPC.prototype.setGenerate = function(bool, procLimit, callback) {
    RPC.call(this, 'setgenerate',  [bool, procLimit ? procLimit : 1], callback);
  };

  BitcoinRPC.prototype.listTransactions = function(account, count, callback) {
    RPC.call(this, 'listtransactions',  [account ? account : '', count ? count : 200], callback);
  };

  BitcoinRPC.prototype.getTransaction = function(txid, callback) {
    RPC.call(this, 'gettransaction',  [txid], callback);
  };

  BitcoinRPC.prototype.createRawTransaction = function(inputs, outputs, callback) {
    RPC.call(this, 'createrawtransaction',  [inputs, outputs], callback);
  };

  BitcoinRPC.prototype.getRawTransaction = function(txid, callback) {
    RPC.call(this, 'getrawtransaction',  [txid], callback);
  };

  BitcoinRPC.prototype.signRawTransaction = function(hexstr, prevouts,
  						     privkeys, sighash,
						     callback) {
    RPC.call(this, 'signrawtransaction', [hexstr, prevouts, privkeys, sighash], callback);
  };

  BitcoinRPC.prototype.sendRawTransaction = function(hexstr, callback) {
    RPC.call(this, 'sendrawtransaction',  [hexstr], callback);
  };

  BitcoinRPC.prototype.decodeRawTransaction = function(hexstr, callback) {
    RPC.call(this, 'decoderawtransaction',  [hexstr], callback);
  };

  BitcoinRPC.prototype.validateAddress = function(address, callback) {
    RPC.call(this, 'validateaddress', [address], callback);
  };

  BitcoinRPC.prototype.addMultiSigAddress = function(n_required, keys, callback) {
    RPC.call(this, 'addmultisigaddress', [n_required, keys], callback);
  };

  BitcoinRPC.prototype.sendToAddress = function(address, amount, callback) {
    RPC.call(this, 'sendtoaddress', [address, amount], callback);
  };

  BitcoinRPC.prototype.setTxFee = function(amount, callback) {
    RPC.call(this, 'settxfee', [amount], callback);
  };

  BitcoinRPC.prototype.keyPoolRefill = function(callback) {
    RPC.call(this, 'keypoolrefill', [], callback);
  };

  BitcoinRPC.prototype.walletPassPhrase = function(phrase, timeout, callback) {
    RPC.call(this, 'walletpassphrase', [phrase, timeout], callback);
  };

  BitcoinRPC.prototype.walletLock = function(callback) {
    RPC.call(this, 'walletlock', [], callback);
  };

  BitcoinRPC.prototype.rpccall = function(method, args, callback) {
    RPC.call(this, method, args, callback);
  };

  function RPC(method, params, callback) {
    var self = this;
    var request;
    if(params) {
      request = {method: method, params: params};
    } else {
      request = {method: method};
    }
    request = JSON.stringify(request);
    var auth = Buffer(self.user + ':' + self.pass).toString('base64');

    var options = {
      host: self.host,
      path: '/',
      method: 'POST',
      port: self.port,
    };
    var req = this.protocol.request(options, function(res) {
      var buf = '';
      res.on('data', function(data) {
        buf += data; 
      });
      res.on('end', function() {
        try {
          var parsedBuf = JSON.parse(buf);
        } catch(e) {
          log.err(e.stack);
          log.err(buf);
          callback(e);
          return;
        }
        callback(parsedBuf.error, parsedBuf);
      });
    });
    req.on('error', function(e) {
      callback(e);
    });
    
    req.setHeader('Content-Length', request.length);
    req.setHeader('Content-Type', 'application/json');
    req.setHeader('Authorization', 'Basic ' + auth);
    req.write(request);
    req.end();
  };

  return BitcoinRPC;
};
module.defineClass(ClassSpec);

