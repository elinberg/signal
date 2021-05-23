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
    price: {
        type: Number
    },
    amount: {
        type: Number
    },
    order_type: {
        type: Number
    },
    order_status: {
        type: Number
    },
    status_message: {
        type: String
    }
    
}, opts
);
module.exports = mongoose.model('Asset', Asset);

