let express = require('express'),
userRoutes = express.Router();
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
let User = require("../data/db/user.model");





// Asset Model
//let Asset = require('../data/db/asset.model');

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

userRoutes.get('/', passport.authenticate('jwt', { session: false}), function(req, res) {
  console.log('hitting here 1...')
  //res.json({'eric': 'eric'});
  var token = getToken(req.headers);
  console.log('token.......',token)
  if (token) {
    User.find(function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


// Delete Asset
userRoutes.delete('/delete/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    User.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data
        })
      }
    })
  });

  module.exports = userRoutes;