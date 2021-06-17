const express = require('express');
const app = express();
//const server = app;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({path:__dirname+'/.env'});
var passport = require('passport');
var config = require('./config/database');
//const Asset = require('./data/db/asset.model')
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var morgan = require('morgan');
require('./utils/redis');

let exchange = require('./data/db/exchange.model')();
const PORT = 4000;
//let Asset = require('./data/db/asset.model');

const assetRoutes = require('./routes/asset.routes');
const authRoutes = require('./routes/login');
const userRoutes = require('./routes/user.routes');
const exchangeRoutes = require('./routes/exchange.routes');
const bitRoutes = require('./routes/bitmart.routes');
const binanceRoutes = require('./routes/binance.us.routes');

app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(passport.initialize());

app.use(cors());

app.use(bodyParser.json());


mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

//app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use('/user', userRoutes);
app.use('/asset', assetRoutes);
app.use('/auth', authRoutes);
app.use('/exchange', exchangeRoutes);
app.use('/bitmart', bitRoutes);
app.use('/binance', binanceRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  app.use((req, res) => res.sendFile('/index.html', { root: __dirname }))
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});




// let Asset = require('./data/db/asset.model');
// setInterval(() => {
// wss.clients.forEach((client) => {
//   Asset.find(function (err, assets) {
//     if (err) return next(err);
//     //console.log(assets)
//     client.send(new Date())
//   });
  
//   });
// }, 10000);

//const server = app;
//const { Server } = require('ws');

// const port = 3001
// const wss = new Server({port});
// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('close', () => console.log('Client disconnected'));
// });
// var events = require('events');



// const mongo = require("mongodb").MongoClient;
// mongo.connect("mongodb://192.168.1.123:27017/?replicaSet=replicaSet").then(client => {
//  console.log("Connected to MongoDB server");
//  // Select DB and Collection
//  const db = client.db("signal");
//  const collection = db.collection("Assets");
//  var options = { fullDocument: 'updateLookup' };
//  // Define change stream
//  const changeStream = collection.watch();
//  // start listen to changes
//  changeStream.on("change", function(event) {
//    console.log('Hooked',JSON.stringify(event));
//  });
// });







//  let Asset = require('./data/db/asset.model');

// const assetStream = Asset().watch({fullDocument: 'updateLookup'}).on('change' , change => {
// console.log('Hooked',change)
// });



// setInterval(() => {
// wss.clients.forEach((client) => {
//   Asset.find(function (err, assets) {
//     if (err) return next(err);
//     //console.log(assets)
//     client.send(JSON.stringify(assets))
//   });
  
//   });
// }, 10000);



// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 10000);
