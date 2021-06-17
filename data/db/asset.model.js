const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const opts = {
// Make Mongoose use Unix time (seconds since Jan 1, 1970)
timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  };
let Asset = new Schema({
    pair: {
        type: String
    },
    symbol: {
        type: String
    },
    open: {
        type: String
    },
    close: {
        type: String
    },
    high: {
        type: String
    },
    low: {
        type: String
    },
    time: {
        type: String
    },
    price: {
        type: Number
    },
    avg_price: {
        type: Number
    },
    qty: {
        type: Number
    },
    filled: {
        type: Number
    },
    side: { //buy/sell
        type: String
    },
    transaction_date: {
        type: String
    },
    exchange_id: {
        type: Number
    },
    order_type: { // market, limit
        type: String
    },
    order_status: {
        type: String
    },
    status_message: {
        type: String
    }
    
}, opts
);
module.exports = mongoose.model('Asset', Asset);

