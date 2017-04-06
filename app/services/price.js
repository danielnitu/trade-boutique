var moment = require('moment')
var Client = require('node-rest-client').Client
var priceClient = new Client()

var INVESTFLY_API = 'https://api.investfly.com/stockmarket/quotes'
var MARKETS = ['US', 'LSE', 'EURO', 'TMX', 'HKE', 'INDIA']

/*
var wagner = require('wagner-core')
require('../models/index')(wagner)
var Price = wagner.invoke(function (Price) {
  return Price
})
*/

function updatePrices (Price) {
  MARKETS.forEach(function (market) {
    Price.find({market: market}, function (err, results) {
      if (err) throw err

      if (results.length > 0) {
        console.log('Found symbols for ' + market)
        var symbols = []

        for (var j = 0; j < results.length; j++) {
          symbols.push(results[j].symbol)
        }

        // DELAY SENDING MULTIPLE API CALLS
        setTimeout(function () {
          getPrices(Price, market, symbols)
        }, 500)
      }
    })
  })
}

// SEND POST REQ TO API, GET PRICES AND SAVE TO DB
function getPrices (Price, market, symbols) {
  var args = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      'market': market,
      'realTime': true,
      'tickers': symbols
    }
  }

  priceClient.post(INVESTFLY_API, args, function (data, res) {
    console.log(moment().format() + ' - Connecting to Investfly Stock API: ' + res.statusCode + ' (' + res.statusMessage + ')')

    if (res.statusCode === 200) {
      var results = data.result

      for (const stock of Object.keys(results)) {
        savePrice(Price, results[stock].symbol, results[stock].lastPrice)
      }
    } else {
      // GET QUOTE SOMEWHERE ELSE

      // ONLY US STOCK AVAILABLE FOR BACKUP API
      if (market === 'US') {
        var ROBINHOOD_API = 'https://api.robinhood.com/quotes/?symbols='

        priceClient.get(ROBINHOOD_API + symbols.toString(), function (data, res) {
          console.log(moment().format() + ' - Connecting to Robinhood Stock API: ' + res.statusCode + ' (' + res.statusMessage + ')')

          if (res.statusCode === 200) {
            var results = data.results

            results.forEach(function (stock) {
              if (stock !== null) {
                savePrice(Price, stock.symbol, stock.ask_price)
              }
            })
          }
        })
      }
    }
  })
}

function savePrice (Price, symbol, price) {
  Price.findOneAndUpdate({symbol: symbol}, {
    $set: {
      price: price
    }
  }, {upsert: true}, function (err, result) {
    if (err) throw err
    console.log('Saved ' + price + ' price for ' + symbol)
  })
}

module.exports = updatePrices
