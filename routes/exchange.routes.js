let express = require('express'),
exchangeRoutes = express.Router();
var passport = require('passport');
let fetch = require('node-fetch');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../data/db/user.model");
let Exchange = require('../data/db/exchange.model');
const _transform = require("./transformer");
const { response } = require('express');
const util = require('util')
const request = require("request");

const axios = require("axios");
//const sync = deasync((promise, callback) => promise.then(result) => callback(null, result)//;




var setExchange = function(data){
  exchange.push(data)
}

let getExchange = function(){
  return exchange;
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
async function apiCall(exchange){
    let options = {method:'get'};

    

  // console.log(`Jan Bodnar: ${u1.data.created_at}`);
  // console.log(`Symfony: ${u2.data.created_at}`);


    try{
      let [timeResult, tickerResult] = await Promise.all([
        axios.get(exchange.exchangeUrl+exchange.timeEndpoint),
        axios.get(exchange.exchangeUrl+exchange.tickerEndpoint)
      ]);
    
    // let response = await fetch(exchange.exchangeUrl+exchange.timeEndpoint, options);
    // let data = await response.json();
    let transformer = new _transform(exchange.name);
      exchange.serverTime = transformer.getTime(timeResult.data).serverTime;
      exchange.tickers = transformer.getTickers(tickerResult.data).tickers;
    //console.log(data);
    return exchange;
    } catch (err) {
      console.error(err)
    }

 }
exchangeRoutes.get('/', passport.authenticate('jwt', { session: false}), function(req, res) {
 
  console.log('hitting here...')
  
  var token = getToken(req.headers);
  console.log('token.......',token)
  if (token) {
      
    Exchange.find(function (err, exchanges) {

      if (err) return next(err);
            
      res.json(exchanges);
    }).lean();
    //res.json(exchanges)
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

exchangeRoutes.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    let id = req.params.id;
    Exchange.findById(id, function(err, exchange) {
        
        exchange.serverTime = '';
        exchange.tickers = '';
        apiCall(exchange).then(result => {
          console.log('Eric',result)
          res.json(exchange);
         }) 

        
    }).lean();
});

exchangeRoutes.post('/add', passport.authenticate('jwt', { session: false}), function(req, res) {
    req.body.map(exchange => {
      console.log(exchange)
      let exch = new Exchange(exchange);
      exch.save()
        .then(exchange => {
            //res.status(200).json({'exchange': 'exchange added successfully',id:exchange._id});
        })
        .catch(err => {
            //res.status(400).send('adding new exchange failed');
        });
      })
      res.status(200).json({'exchange': 'exchange added successfully'});
});

exchangeRoutes.post('/update/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    
    Exchange.findById(req.params.id, function(err, exchange) {
        if (!exchange)
            res.status(404).send("data is not found");
        else
            exchange.name = req.body.name;
            exchange.tickerEndpoint = req.body.tickerEndpoint;
            exchange.timeEndpoint = req.body.timeEndpoint;
            exchange.statusEndpoint = req.body.statusEndpoint;
            exchange.url = req.body.url;
            exchange.exchangeUrl = req.body.exchangeUrl;
            exchange.serverTime = req.body.serverTime;
            //exchange = (req.body};
            
            exchange.save().then(exchange => {
                res.json('exchange updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

// Delete Asset
exchangeRoutes.delete('/delete/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    Exchange.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data
        })
      }
    })
  });

  module.exports = exchangeRoutes;