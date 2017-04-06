var express = require('express')
var bodyparser = require('body-parser')

module.exports = function (wagner) {
  var api = express.Router()

  api.use(bodyparser.json())

  // NEWS BY STOCK SYMBOL
  api.get('/:symbol', wagner.invoke(function (News) {
    return function (req, res) {
      News.findOne({symbol: req.params.symbol.toUpperCase()}, function (err, news) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }
        if (!news) {
          return res
            .status(404)
            .json({error: 'No news for ' + req.params.symbol})
        }
        res.json({news: news})
      })
    }
  }))

  return api
}
