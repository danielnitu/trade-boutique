/*
  *** SYMBOL DATA SERVICE ***
    - EXECUTES ONCE A DAY -

  Updates the symbol-data collection by
  retrieving all symbols from the collection
  and sending requests pre-packed with symbols
  to the the Yahoo Open Table Data API

*/

var moment = require('moment')
var Client = require('node-rest-client').Client
var dataClient = new Client()

var YAHOO_DATA = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('
var YAHOO_DATA_END = ')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'

// var wagner = require('wagner-core')
// require('../models/index')(wagner)
// var SymbolData = wagner.invoke(function (SymbolData) {
//   return SymbolData
// })

function symbolData () {
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

        getData(symbols)
        symbols = ''
      }
    })
    symbols = symbols.slice(0, -1)
    getData(symbols)
  })
}

function getData (symbols) {
  dataClient.get(YAHOO_DATA + symbols + YAHOO_DATA_END, function (data, res) {
    console.log(moment().format() +
      ' - Connecting to Yahoo Data API: ' +
      res.statusCode + ' (' +
      res.statusMessage + ')')

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

module.exports = symbolData
