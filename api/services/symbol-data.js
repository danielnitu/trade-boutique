/*
  *** SYMBOL DATA SERVICE ***
    - EXECUTES ONCE A DAY -

  Updates the symbol-data collection by
  retrieving all symbols from the collection
  and sending requests pre-packed with symbols
  to the the Yahoo Open Table Data API

*/

var moment = require('moment')
var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'symbolDataService'})
var Client = require('node-rest-client').Client
var dataClient = new Client()

var YAHOO_DATA = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('
var YAHOO_DATA_END = ')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'

// var wagner = require('wagner-core')
// require('../models/index')(wagner)
// var SymbolData = wagner.invoke(function (SymbolData) {
//   return SymbolData
// })

function symbolData (SymbolData) {
  SymbolData.find({})
  .select('symbol -_id')
  .exec(function (err, data) {
    if (err) throw err

    var symbols = ''
    data.forEach(function (symbol, index) {
      symbols += '"' + symbol.symbol + '",'

      // REQUEST DATA FOR 400 SYMBOLS AT A TIME
      if (index !== 0 && index % 400 === 0) {
        // remove last comma from string
        symbols = symbols.slice(0, -1)

        getData(SymbolData, symbols)
        symbols = ''
      }
    })
    symbols = symbols.slice(0, -1)
    getData(SymbolData, symbols)
  })
}

function getData (SymbolData, symbols) {
  dataClient.get(YAHOO_DATA + symbols + YAHOO_DATA_END, function (data, res) {
    log.info('Connecting to Yahoo Data API: ' + res.statusCode + ' (' + res.statusMessage + ')')

    if (res.statusCode === 200) {
      console.log(moment().format() + ' - Found ' + data.query.count + ' records.')

      var stocks = data.query.results.quote

      stocks.forEach(function (stock) {
        if (stock.Name !== null) {
          SymbolData.findOneAndUpdate({symbol: stock.symbol}, {
            $set: {
              company: stock.Name,
              yearHigh: stock.YearHigh,
              yearLow: stock.YearLow,
              marketCap: stock.MarketCapitalization,
              EPSEstNextQt: stock.EPSEstimateNextQuarter,
              EBITDA: stock.EBITDA,
              PERatio: stock.PERatio,
              dividendPayDate: stock.DividendPayDate
            }
          }, function (err) {
            if (err) throw err
          })
        }
      })
    }
  })
}

function getDataForSymbol (SymbolData, symbol, market, cb) {
  var args = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  dataClient.get('https://api.investfly.com/stockmarket/metric?symbol=' + symbol + '&market=' + market,
    args, function (data, res) {
      log.info('Connecting to Investfly Data API (' + symbol + '): ' + res.statusCode + ' (' + res.statusMessage + ')')

      if (res.statusCode === 200) {
        SymbolData.create({
          symbol: data.symbol,
          company: data.name,
          market: data.market,
          yearHigh: data.high52Week,
          yearLow: data.low52Week,
          marketCap: data.marketCap,
          EPSEstNextQt: data.EPSEstNextQt || null,
          EBITDA: data.ebitda || null,
          PERatio: data.peRatio || null
        }, function (err, data) {
          if (err) {
            console.log(err)
            return cb('Error: unable to save to database (getDataForSymbol) - ' + err)
          }
          return cb(null, data)
        })
      } else {
        cb('Error: ' + data.message, null)
      }
    })
}

module.exports = {
  symbolData: symbolData,
  getDataForSymbol: getDataForSymbol
}
