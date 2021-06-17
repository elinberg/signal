let express = require('express'),
assetRoutes = express.Router();
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../data/db/user.model");
// Asset Model
let Asset = require('../data/db/asset.model');

var emitter = require('events').EventEmitter;

var em = new emitter();


// const WebSocket = require('ws');

// const { Server } = require('ws');
// const port = 3001
// const wss = new Server({port});
// wss.on('connection', (ws) => {
// console.log('Client connected');

// ws.on('close', () => console.log('Client disconnected'));
//});
//
var HOST = 'wss://stream.binance.com:9443/ws/shibusdt@miniTicker'
//var wsC = new WebSocket(HOST);
// em.addListener('FirstEvent', function (data) {
//   console.log('First subscriber: ' + data);
//   wss.clients.forEach((client) => {
  
//     client.send(data)
//   })
//   //console.log(event)
   

//   });
//wsC.onmessage = function (event) {
  
  

//};




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

assetRoutes.get('/', passport.authenticate('jwt', { session: false}), function(req, res) {
  console.log('hitting here...')
  
  var token = getToken(req.headers);
  console.log('token.......',token)
  if (token) {
    Asset.find(function (err, assets) {
      if (err) return next(err);
      res.json(assets);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});
assetRoutes.get('/schema', passport.authenticate('jwt', { session: false}), function(req, res) {
  //let timestamp,date, formatted;
  //console.log('PATH', req);
  var token = getToken(req.headers);
  console.log('token.......',token)
  if (token) {
    let schema = [];
    Asset.schema.eachPath(function(path) {
      
      console.log('PATH',path);
      schema.push(path)

    });  
    
    res.status(200).json({schema});
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
    
});



assetRoutes.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    let id = req.params.id;
    Asset.findById(id, function(err, asset) {
        res.json(asset);
    });
});




assetRoutes.post('/add', passport.authenticate('jwt', { session: false}), function(req, res) {
  let timestamp,date, formatted;
  let asset = {};
  Asset.schema.eachPath(function(path) {
    //console.log(path);
    if(req.body[path] !== undefined){
      if(path.substring(0,1) !== '_'){
        
        if(path === 'transaction_date'){
          try {
            timestamp = Number.parseInt(req.body[path]) + 1000; //convert to milli's
            date = new Date(timestamp)
            formatted = date.toLocaleString("en-US", {year: "numeric"}) + '-' + 
            date.toLocaleString("en-US", {month: "numeric"}) + '-' +
            date.toLocaleString("en-US", {day: "numeric"}) + ' ' +
            date.toLocaleTimeString('en-US')
            
          } catch (e) {
            console.log('Date Parese Error', e);
          }
          asset[path] = formatted
        } else {
          asset[path] = req.body[path];
        }
      }
                    
    }
  });  
  
  let assetObj = new Asset(asset);
    assetObj.save()
        .then(asset => {
            res.status(200).json({'asset': 'asset added successfully',id:assetObj._id});
        })
        .catch(err => {
            res.status(400).send('adding new asset failed'+err);
        });
});

assetRoutes.post('/update/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    
    let timestamp,date, formatted;
    Asset.findById(req.params.id, function(err, asset) {
        if (!asset)
            res.status(404).send("data is not found");
        else

            Asset.schema.eachPath(function(path) {
              console.log(path);
              if(req.body[path] !== undefined){
                if(path.substring(0,1) !== '_'){
                  if(path === 'transaction_date'){
                    try {
                      timestamp = Number.parseInt(req.body[path]) + 1000; //convert to milli's
                      date = new Date(timestamp)
                      formatted = date.toLocaleString("en-US", {year: "numeric"}) + '-' + 
                      date.toLocaleString("en-US", {month: "numeric"}) + '-' +
                      date.toLocaleString("en-US", {day: "numeric"}) + ' ' +
                      date.toLocaleTimeString('en-US')
                      
  
                    } catch (e) {
                      console.log('Date Parse Error', e);
                    }
  
                    asset[path] = formatted
                    
                    
                  } else {
                    asset[path] = req.body[path];
                  }
                  
                }
                
                              
              }
              
            });
            asset.save().then(asset => {
              res.json('Asset updated!');
              }).catch(err => {
                res.status(400).send("Update not possible"+err);
            //res.status(400).send(body)
              });
           // em.emit('FirstEvent', JSON.stringify(asset));
            
            
    });
});

// Delete Asset
assetRoutes.delete('/delete/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    Asset.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data
        })
      }
    })
  });

  module.exports = assetRoutes;