let express = require('express'),
assetRoutes = express.Router();
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../data/db/user.model");
// Asset Model
let Asset = require('../data/db/asset.model');

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

assetRoutes.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    let id = req.params.id;
    Asset.findById(id, function(err, asset) {
        res.json(asset);
    });
});

assetRoutes.post('/add', passport.authenticate('jwt', { session: false}), function(req, res) {
    let asset = new Asset(req.body);
    asset.save()
        .then(asset => {
            res.status(200).json({'asset': 'asset added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new asset failed');
        });
});

assetRoutes.post('/update/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    Asset.findById(req.params.id, function(err, asset) {
        if (!asset)
            res.status(404).send("data is not found");
        else
            asset.pair = req.body.pair;
            asset.price = req.body.price;
            asset.amount = req.body.amount;
            asset.order_type = req.body.order_type;
            asset.order_status = req.body.order_status;
            asset.status_message = req.body.status_message;
            
            asset.save().then(asset => {
                res.json('Asset updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
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