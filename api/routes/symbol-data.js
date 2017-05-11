var express = require('express')
var bodyparser = require('body-parser')
var getDataForSymbol = require('../services/symbol-data').getDataForSymbol
var updateDataForSymbol = require('../services/symbol-data').updateDataForSymbol

module.exports = function (wagner) {
  var api = express.Router()

  api.use(bodyparser.json())

  // STOCK DATA BY STOCK SYMBOL AND MARKET
  api.get('/symbol/:symbol/:market?', wagner.invoke(function (SymbolData) {
    return function (req, res) {
      SymbolData.findOne({symbol: req.params.symbol}, function (err, data) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }
        if (!data) {
          getDataForSymbol(SymbolData, req.params.symbol, req.params.market, function (err, symbolData) {
            if (err) {
              return res.json({error: err})
            }
            return res.json({data: symbolData})
          })
        } else if (data && (!data.updatedAt || (Date.now() - new Date(data.updatedAt) >= 1000 * 60 * 60 * 24))) {
          updateDataForSymbol(SymbolData, req.params.symbol, data.market, function (err, symbolData) {
            if (err) {
              return res.json({error: err})
            }
            return res.json({data: symbolData})
          })
        } else {
          return res.json({data: data})
        }
      })
    }
  }))

  // LIST OF SYMBOLS (USED MAINLY FOR SEARCH BAR)
  api.get('/symbols/:symbol', wagner.invoke(function (SymbolData) {
    return function (req, res) {
      SymbolData.find(
        {symbol: {$regex: '^' + req.params.symbol.toUpperCase()}},
        {symbol: 1, _id: 0},
        function (err, data) {
          if (err) {
            return res
              .status(500)
              .json({error: err.toString()})
          }
          res.json({data: data})
        }).limit(10)
    }
  }))

  // DATA FOR MULTIPLE SYMBOLS
  api.post('/multiple', wagner.invoke(function (SymbolData) {
    return function (req, res) {
      SymbolData.find({
        'symbol': {$in: req.body}
      }, function (err, data) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }

        res.json({data: data})
      })
    }
  }))

  return api
}
