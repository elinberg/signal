const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var morgan = require('morgan');
var passport = require('passport');
var config = require('./config/database');


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
mongoose.connect('mongodb://127.0.0.1:27017/signal', { useNewUrlParser: true, useUnifiedTopology: true });
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

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});