var express = require('express')
var bodyparser = require('body-parser')

module.exports = function (wagner) {
  var api = express.Router()

  api.use(bodyparser.json())

  // NEWS BY STOCK SYMBOL
  api.get('/:symbol', wagner.invoke(function (SymbolData) {
    return function (req, res) {
      SymbolData.findOne({symbol: req.params.symbol}, function (err, data) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }
        if (!data) {
          return res
            .status(404)
            .json({error: 'No data for ' + req.params.symbol})
        }
        res.json({data: data})
      })
    }
  }))

  return api
}
