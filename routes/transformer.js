
class Transformer {
    constructor(exchangeName) {
      this.name = exchangeName;

    }

    getTime(response) {
      if(this.name === 'Bitmart'){
        var transformed = {};
        //console.log(response)
        transformed.serverTime=response.data.server_time;
        return transformed;
      }
      if(this.name === 'Binance'){
        var transformed = {};

        //console.log(response)
        transformed.serverTime=response.serverTime;
        return transformed ;
      }
    }
    getTickers(response) {
        if(this.name === 'Bitmart'){
          var transformed = {};
          //console.log(response)
          
          transformed.tickers=response.data.symbols;
          return transformed;
        }
        if(this.name === 'Binance'){
          var transformed = {};
          var tickers = [];
          
          for(let i = 0; i < response.symbols.length;i++){
            tickers.push(response.symbols[i].baseAsset + '_' + response.symbols[i].quoteAsset)
          }
  
          //console.log(response)
          transformed.tickers=tickers;
          return transformed ;
        }
      }
      getWallet(response) {
        // if(this.name === 'Bitmart'){
        //   var transformed = {};
        //   //console.log(response)
          
        //   transformed.tickers=response.data.symbols;
        //   return transformed;
        // }
        if(this.name === 'Binance'){
          var transformed = {};
          var tickers = [];      
          for(let i = 0; i < response.length;i++){
            tickers.push({id: response[i].asset, name: response[i].asset, available:response[i].free, frozen:response[i].locked})
          }
          transformed.wallet=tickers;
          return transformed ;
        }
      }
  }
  module.exports = Transformer ;