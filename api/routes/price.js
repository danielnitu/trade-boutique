var express = require('express')
var bodyparser = require('body-parser')

module.exports = function (wagner) {
  var api = express.Router()

  api.use(bodyparser.json())

  // PRICE BY STOCK SYMBOL
  api.get('/:symbol', wagner.invoke(function (Price) {
    return function (req, res) {
      Price.findOne({symbol: req.params.symbol.toUpperCase()}, function (err, price) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }
        if (!price) {
          return res
            .status(404)
            .json({error: 'Symbol ' + req.params.symbol + ' not found!'})
        }
        res.json({price: price})
      })
    }
  }))

  return api
}
