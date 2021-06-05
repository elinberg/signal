var mongoose = require('mongoose');
var config = require('../config/database');
var express = require('express');
var jwt = require('jsonwebtoken');
var authRouter = express.Router();
var User = require("../data/db/user.model");
const { deleteOne } = require('../data/db/user.model');



//Purpose: To register a new user
authRouter.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Account already exists.'});
      }
      res.json({success: true, msg: 'Successful created new account.'});
    });
  }
});

authRouter.post('/wss', function(req, res) {


  res.json({success: true, token: 'JWT ' });

});

//Purpose: To sign in an existing user
authRouter.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. No Account found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token, username: req.body.username});
        } else {
          res.status(401).send({success: false, msg: 'Password Mismatch.'});
        }
      });
    }
  });
});
module.exports = authRouter;