let express = require('express');
let fetch = require('node-fetch'),
binanceRoutes = express.Router();
var passport = require('passport');
var config = require('../config/database');

//[linux]$ echo -n "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559" | openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
//(stdin)= c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71

require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../data/db/user.model");
const URLUS = 'https://api.binance.us'
const URL = 'https://api.binance.com'
//const { Binance } = require("./transformer")
const _transform = require("./transformer");

var getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  var getKey = function (headers) {
    if (headers && headers.xbmkey ) { //
      //console.log('HEAD', headers)
      return headers.xbmkey;
    } else {
      return null;
    }
  };

  var getSecret = function (headers) {
    if (headers && headers.xbmsecret ) { //
      //console.log('HEAD', headers)
      return headers.xbmsecret;
    } else {
      return null;
    }
  };

  binanceRoutes.get('/time', passport.authenticate('jwt', { session: false}), function(req, res) {
    console.log('hitting /time')
    
    var token = getToken(req.headers);
    console.log('token.......',token)
    if (token) {
        let transformer = new _transform('Binance')


        fetch(URL+'/api/v3/time')
        .then(response => response.json())
        .then(data => res.json(transformer.getTime(data)))
        .catch((error) => {
          // Handle the error
          console.log(error);
        });
        
  
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });
  binanceRoutes.get('/accounts', passport.authenticate('jwt', { session: false}), function(req, res) {

//openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
// key:jAz1FmvSy3xdWqAEMwTbfLLf2otUcbSfXoLnl8Xzpwx3HpKOyNX9PUroF5Is3xJh
// secret:LzNWXKhxE56z3VKHqZGcjFyyMoYSRxGxTB9CEktZCpxH3AOrXUiult6eFUTpLj9T

    console.log('hitting Accounts')
    
    var token = getToken(req.headers);
    var key = getKey(req.headers);
    var secret = getSecret(req.headers);
    var timestamp = Date.now().toString();
    var signature = require("crypto")
  .createHmac("sha256", secret)
  .update('timestamp='+timestamp)
  .digest("hex"); //binary, hex,base64
    console.log('key,secret,timestamp,signature', key, secret, timestamp,signature)




    if (token) {
        //let transformer = new _transform('Bitmart')
        let transformer = new _transform('Binance')
        let qs = 'timestamp='+timestamp+'&signature='+signature;
        //json = JSON.stringify({timestamp: timestamp, signature:signature})
        fetch(URLUS+'/api/v3/account?'+qs,{timeout: 30000, headers:{	'X-MBX-APIKEY': key }})
        .then(response => response.json())
        .then(data => { 

          let filtered = data.balances.filter(ticker => parseFloat(ticker.free) > 0 )

          res.json(transformer.getWallet(filtered))
        })
        .catch((error) => {
          // Handle the error
          console.log(error);
        });
        
  
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });
  binanceRoutes.get('/tickers', passport.authenticate('jwt', { session: false}), function(req, res) {
    console.log('hitting /tickers')
    
    var token = getToken(req.headers);
    console.log('token.......',token)
    if (token) {
        let transformer = new _transform('Binance')

        fetch(URL+'/api/v3/exchangeInfo')
        .then(response => response.json())
        .then(data => res.json(transformer.getTickers(data)))
        .catch((error) => {
          // Handle the error
          console.log(error);
        });
        
  
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });
  binanceRoutes.get('/status', passport.authenticate('jwt', { session: false}), function(req, res) {
    console.log('hitting /status')
    
    var token = getToken(req.headers);
    console.log('token.......',token)
    if (token) {


        fetch(URL+'/api/v3/ping')
        .then(response => response.json())
        .then(data => res.json(data))
        .catch((error) => {
          // Handle the error
          console.log(error);
        });
        
  
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  module.exports = binanceRoutes;