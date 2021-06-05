let express = require('express');
let fetch = require('node-fetch'),
bitRoutes = express.Router();
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../data/db/user.model");
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
  bitRoutes.get('/time', passport.authenticate('jwt', { session: false}), function(req, res) {
    console.log('hitting /time')
    
    var token = getToken(req.headers);
    console.log('token.......',token)
    if (token) {
        let transformer = new _transform('Bitmart')
        
        fetch('https://api-cloud.bitmart.com/system/time')
        .then(response => response.json())
        .then(data => res.json( transformer.getTime(data)))
        .catch((error) => {
          // Handle the error
          console.log(error);
        });
        
  
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });
  bitRoutes.get('/tickers', passport.authenticate('jwt', { session: false}), function(req, res) {
    console.log('hitting /tickers')
    
    var token = getToken(req.headers);
    console.log('token.......',token)
    if (token) {
        let transformer = new _transform('Bitmart')

        fetch('https://api-cloud.bitmart.com/spot/v1/symbols',{timeout: 30000})
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
  bitRoutes.get('/accounts', passport.authenticate('jwt', { session: false}), function(req, res) {
    console.log('hitting Accounts')
    
    var token = getToken(req.headers);
    var key = getKey(req.headers);
    var secret = getSecret(req.headers);
    //console.log('token,key',token, key)
    if (token) {
        //let transformer = new _transform('Bitmart')

        fetch('https://api-cloud.bitmart.com/spot/v1/wallet',{timeout: 30000, headers:{	'X-BM-KEY': key }})
        .then(response => response.json())
        .then(data => res.json(data.data))
        .catch((error) => {
          // Handle the error
          console.log(error);
        });
        
  
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });
  bitRoutes.get('/trades', passport.authenticate('jwt', { session: false}), function(req, res) {
    console.log('hitting Trades', req.query.symbol);
    
    var token = getToken(req.headers);
    var key = getKey(req.headers);
    var secret = getSecret(req.headers);
    //console.log('token,key',token, key)
    if (token) {
        //let transformer = new _transform('Bitmart')

        fetch('https://api-cloud.bitmart.com/spot/v1/orders?limit=10&offset=1&status='+req.query.status+'&symbol='+ req.query.symbol,{timeout: 30000, headers:{	'X-BM-KEY': key , 'X-BM-SIGN': secret}})
        .then(response => response.json())
        .then(data => { 
         // {trades:data.data['orders'],current_page:data.data.current_page},
          res.json({current_page:data.data.current_page,trades:data.data['orders']})
        })
        .catch((error) => {
          // Handle the error
          console.log(error);
        });
        
  
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });
  bitRoutes.get('/status', passport.authenticate('jwt', { session: false}), function(req, res) {
    console.log('hitting /status')
    
    var token = getToken(req.headers);
    console.log('token.......',token)
    if (token) {


        fetch('https://api-cloud.bitmart.com/system/status')
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

  module.exports = bitRoutes;