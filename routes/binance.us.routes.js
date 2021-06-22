let express = require('express');
let fetch = require('node-fetch');
let axios = require('axios');
let binanceRoutes = express.Router();
var passport = require('passport');
var config = require('../config/database');
const URLUS = 'https://api.binance.us'
const URL = 'https://api.binance.com'
const _transform = require("./transformer");

//[linux]$ echo -n "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559" | openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
//(stdin)= c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71

function getAllData(endpoints) {

  console.log(endpoints)
  return Promise.all(endpoints.map(fetchData));
}



function fetchData(endpoint) {
  // var token = getToken(req.headers);
  // var key = getKey(req.headers); 
  //console.log(URL)
  return fetch(endpoint.url, endpoint.options)
    .then(response => response.json())
    .then(data => {

      if (data) {
        //console.log(data)
        return {
          success: true,
          data: data
        };
      }

    })
    .catch(function (error) {
      return { success: false, error: !error ? '' : error };
    });
}


var getListenKey = function (symbol = 'DOGEUSD', callback) {


  console.log('Refreshing Listenkey', listenKey)
  fetch(URLUS + '/api/v3/userDataStream?listenKey=' + listenKey, { method: 'put', timeout: 30000, headers: { 'X-MBX-APIKEY': key } })
  //   .then(response => response.json())
  //   .catch((error) => {
  //     // Handle the error
  //     console.log(error);
  //   });
}

var getTime = function (xform, callback) {
  fetch(URLUS + '/api/v3/time')
    .then(response => response.json())
    .then(time => {

      let t = time
      console.log('TIME:', t.serverTime)
      callback(t)

    })
    .catch((error) => {
      // Handle the error
      console.log(error);
    });
  // console.log('TIME', servertime)
}

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
  if (headers && headers.xbmkey) { //
    //console.log('HEAD', headers)
    return headers.xbmkey;
  } else {
    return null;
  }
};

var getSecret = function (headers) {
  if (headers && headers.xbmsecret) { //
    //console.log('HEAD', headers)
    return headers.xbmsecret;
  } else {
    return null;
  }
};

binanceRoutes.get('/time', passport.authenticate('jwt', { session: false }), function (req, res) {
  console.log('hitting /time')

  var token = getToken(req.headers);
  console.log('token.......', token)
  if (true) {
    let transformer = new _transform('Binance')


    fetch(URLUS + '/api/v3/time')
      .then(response => response.json())
      .then(data => res.json(transformer.getTime(data)))
      .catch((error) => {
        // Handle the error
        console.log(error);
      });


  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});
binanceRoutes.get('/accounts', passport.authenticate('jwt', { session: false }), function (req, res) {

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
    .update('timestamp=' + timestamp)
    .digest("hex"); //binary, hex,base64
  //console.log('key,secret,timestamp,signature', key, secret, timestamp,signature)




  if (token) {
    //let transformer = new _transform('Bitmart')
    let transformer = new _transform('Binance')
    let qs = 'timestamp=' + timestamp + '&signature=' + signature;
    //json = JSON.stringify({timestamp: timestamp, signature:signature})
    fetch(URLUS + '/api/v3/account?' + qs, { timeout: 30000, headers: { 'X-MBX-APIKEY': key } })
      .then(response => response.json())
      .then(data => {

        let filtered = data.balances.filter(ticker => parseFloat(ticker.free) > 0)

        res.json(transformer.getWallet(filtered))

      })
      .catch((error) => {
        // Handle the error
        console.log(error);
      });


  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});
binanceRoutes.get('/trades', passport.authenticate('jwt', { session: false }), function (req, res) {

  //openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
  // key:jAz1FmvSy3xdWqAEMwTbfLLf2otUcbSfXoLnl8Xzpwx3HpKOyNX9PUroF5Is3xJh
  // secret:LzNWXKhxE56z3VKHqZGcjFyyMoYSRxGxTB9CEktZCpxH3AOrXUiult6eFUTpLj9T
//   let serverTime 
  
//   getAllData([{ 
//     url:URLUS + '/api/v3/time',
//     options: {
//       method: 'get',
//       timeout: 3000,
//       headers: { "X-MBX-APIKEY": key }
//     }
//   }])
//   .then(response => {
//     if (response === undefined  ) {
//       return //res.status(404).send({ success: false, msg:'Eric' });
//     }
//     console.log(response)
//     serverTime =  response.serverTime//res.status(200).send({ success: true, data: response });
//   }).catch(e => {
//     console.log(e)
//     return res.status(404).send({ success: false, error: e });
//   })
// console.log('SERVERTIME',serverTime)

  let symbol = req.query.symbol
  var secret = getSecret(req.headers);
  var key = getKey(req.headers);
  var timestamp = Date.now();
  var rcv = '&recvWindow=60000'
  var signature = require("crypto")
    .createHmac("sha256", secret)
    .update('timestamp=' + timestamp + '&symbol=' + symbol + rcv)
    .digest("hex");
  let qs = 'timestamp=' + timestamp + '&symbol=' + symbol + '&signature=' + signature + rcv
  let endpoints = [
    { url: URLUS + "/api/v3/userDataStream", options: { method: 'post', timeout: 3000, headers: { "X-MBX-APIKEY": key } } },
    { url: URLUS + '/api/v3/openOrders?' + qs, options: { method: 'get', timeout: 3000, headers: { "X-MBX-APIKEY": key } } }
  ]
  let trades
  = []
  getAllData(endpoints)
  .then(response => {
    if (response[0] === undefined && response[1] === undefined ) {
      return
    }
    trades = response
     return res.status(200).send({ success: true, listenKey: response[0].data.listenKey, data: response[1].data });
  }).catch(e => {
    console.log(e)
    return res.status(404).send({ success: false, error: e });
  })


});
binanceRoutes.get('/orders', passport.authenticate('jwt', { session: false }), function (req, res) {

  //openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
  // key:jAz1FmvSy3xdWqAEMwTbfLLf2otUcbSfXoLnl8Xzpwx3HpKOyNX9PUroF5Is3xJh
  // secret:LzNWXKhxE56z3VKHqZGcjFyyMoYSRxGxTB9CEktZCpxH3AOrXUiult6eFUTpLj9T

  console.log('hitting Orders')

  var token = getToken(req.headers);
  var key = getKey(req.headers);
  var secret = getSecret(req.headers);
  var timestamp = Date.now().toString();
  var signature = require("crypto")
    .createHmac("sha256", 'LzNWXKhxE56z3VKHqZGcjFyyMoYSRxGxTB9CEktZCpxH3AOrXUiult6eFUTpLj9T')
    .update('timestamp=' + 1624263094803 + '&symbol=DOGEUSD')
    .digest("hex"); //binary, hex,base64
  console.log('key,secret,timestamp,signature', key, secret, timestamp, signature)




  if (token) {
    //let transformer = new _transform('Bitmart')
    let transformer = new _transform('Binance')
    let qs = 'timestamp=' + timestamp + '&signature=' + signature;
    //json = JSON.stringify({timestamp: timestamp, signature:signature})
    fetch(URLUS + '/api/v3/userDataStream', { method: 'post', timeout: 30000, headers: { 'X-MBX-APIKEY': key } })
      .then(response => response.json())
      .then(data => {

        //let filtered = data.balances.filter(ticker => parseFloat(ticker.free) > 0 )
        if (data.listenKey !== undefined) {
          res.json(data)
        }

        //res.json(transformer.getWallet(filtered))
      })
      .catch((error) => {
        // Handle the error
        console.log(error);
      });


  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});
binanceRoutes.get('/tickers', passport.authenticate('jwt', { session: false }), function (req, res) {
  console.log('hitting /tickers')

  var token = getToken(req.headers);
  console.log('token.......', token)

  if (token) {
    let transformer = new _transform('Binance')

    fetch(URLUS + '/api/v3/exchangeInfo')
      .then(response => response.json())
      .then(data => {
        if (data === undefined || data.serverTime === undefined) return;
        res.json(transformer.getTickers(data))

      })
      .catch((error) => {
        // Handle the error
        console.log(error);
      });


  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});
binanceRoutes.get('/status', passport.authenticate('jwt', { session: false }), function (req, res) {
  console.log('hitting /status')

  var token = getToken(req.headers);
  console.log('token.......', token)
  if (token) {


    fetch(URLUS + '/api/v3/ping')
      .then(response => response.json())
      .then(data => res.json(data))
      .catch((error) => {
        // Handle the error
        console.log(error);
      });


  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

module.exports = binanceRoutes;

