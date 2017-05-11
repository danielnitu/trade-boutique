var express = require('express')
var bodyparser = require('body-parser')
var getPrice = require('../services/price').getPrice

module.exports = function (wagner) {
  var api = express.Router()

  api.use(bodyparser.json())

  // PRICE BY STOCK SYMBOL AND MARKET
  api.get('/:symbol/:market?', wagner.invoke(function (Price) {
    return function (req, res) {
      Price.findOne({symbol: req.params.symbol.toUpperCase()}, function (err, price) {
        if (err) {
          return res
            .status(500)
            .json({error: err})
        }
        if (!price) {
          getPrice(Price, req.params.market, req.params.symbol, function (err, result) {
            if (err) {
              return res.status(400).json({error: err})
            }
            res.json({price: result})
          })
        } else {
          res.json({price: price})
        }
      })
    }
  }))

  // PRICES FOR MULTIPLE SYMBOLS
  api.post('/multiple', wagner.invoke(function (Price) {
    return function (req, res) {
      Price.find({
        'symbol': {$in: req.body}
      }, function (err, prices) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }

        res.json({prices: prices})
      })
    }
  }))

  return api
}
