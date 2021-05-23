const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = {
// Make Mongoose use Unix time (seconds since Jan 1, 1970)
timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  };
let Exchange = new Schema({
    name: {
        type: String
    },
    url: {
        type: String
    },
    exchangeUrl: {
        type: String
    },
    tickerEndpoint: {
        type: String
    },
    timeEndpoint: {
        type: String
    },
    statusEndpoint: {
        type: String
    }
    
    
}, opts




);

Exchange.virtual('setServerTime').set(function(time){
this.serverTime = time;
})
Exchange.virtual('serverTime').get(function(){
    return this.serverTime
})
module.exports = mongoose.model('Exchange', Exchange);