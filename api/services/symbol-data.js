/*
  *** SYMBOL DATA SERVICE ***
    - EXECUTES WHEN NEEDED -

  - Gets data from API and returns it
  if symbol doesn't exist in the database
  - Updates data and returns it if data is
  older that one day
  - Requires SymbolData model injection
  when invoked

*/

var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'symbolDataService'})
var Client = require('node-rest-client').Client
var dataClient = new Client()

function getDataForSymbol (SymbolData, symbol, market, cb) {
  var args = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  dataClient.get('https://api.investfly.com/stockmarket/metric?symbol=' + symbol + '&market=' + market,
    args, function (data, res) {
      log.info('Connecting to Investfly Data API (new symbol: ' + symbol + '): ' + res.statusCode + ' (' + res.statusMessage + ')')

      if (res.statusCode === 200) {
        SymbolData.create({
          symbol: data.symbol,
          company: data.name,
          market: data.market,
          exchange: data.exchange,
          sector: data.sector || null,
          industry: data.industry || null,
          high52Week: data.high52Week,
          low52Week: data.low52Week,
          marketCap: data.marketCap || null,
          eps: data.eps || null,
          ebitda: data.ebitda || null,
          peRatio: data.peRatio || null,
          returnOnEquity: data.returnOnEquity || null,
          revenue: data.revenue || null,
          netIncome: data.netIncome || null,
          grossProfit: data.grossProfit || null,
          dividendYield: data.dividendYield || null
        }, function (err, data) {
          if (err) {
            return cb('Error: unable to save to database (getDataForSymbol) - ' + err)
          }
          return cb(null, data)
        })
      } else {
        cb('Error: ' + data.message, null)
      }
    })
}

function updateDataForSymbol (SymbolData, symbol, market, cb) {
  var args = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  dataClient.get('https://api.investfly.com/stockmarket/metric?symbol=' + symbol + '&market=' + market,
    args, function (data, res) {
      log.info('Connecting to Investfly Data API (update symbol: ' + symbol + '): ' + res.statusCode + ' (' + res.statusMessage + ')')

      if (res.statusCode === 200) {
        SymbolData.findOneAndUpdate({symbol: symbol}, {
          $set: {
            symbol: data.symbol,
            company: data.name,
            market: data.market,
            exchange: data.exchange,
            sector: data.sector || null,
            industry: data.industry || null,
            high52Week: data.high52Week,
            low52Week: data.low52Week,
            marketCap: data.marketCap || null,
            eps: data.eps || null,
            ebitda: data.ebitda || null,
            peRatio: data.peRatio || null,
            returnOnEquity: data.returnOnEquity || null,
            revenue: data.revenue || null,
            netIncome: data.netIncome || null,
            grossProfit: data.grossProfit || null,
            dividendYield: data.dividendYield || null
          }
        }, {new: true}, function (err, stock) {
          if (err) {
            return cb('Error: unable to save to database (updateDataForSymbol) - ' + err)
          }
          return cb(null, stock)
        })
      } else {
        cb('Error: ' + data.message, null)
      }
    })
}

module.exports = {
  updateDataForSymbol: updateDataForSymbol,
  getDataForSymbol: getDataForSymbol
}
