var express = require('express')
var bodyparser = require('body-parser')
var getNews = require('../services/news')

module.exports = function (wagner) {
  var api = express.Router()

  api.use(bodyparser.json())

  // NEWS BY STOCK SYMBOL
  api.get('/symbol/:symbol', wagner.invoke(function (News) {
    return function (req, res) {
      News.findOne({symbol: req.params.symbol.toUpperCase()}, function (err, news) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }

        if (!news) {
          getNews(req.params.symbol, News, function (err, news) {
            if (err) {
              res.json({error: err.toString()})
            } else {
              res.json({news: news})
            }
          })
        } else if (news && (!news.updatedAt || (Date.now() - new Date(news.updatedAt) >= 1000 * 60 * 60 * 24))) {
          getNews(req.params.symbol, News, function (err, news) {
            if (err) {
              res.json({error: err.toString()})
            } else {
              res.json({news: news})
            }
          })
        } else {
          res.json({news: news})
        }
      })
    }
  }))

  // RANDOM NEWS ARTICLES
  api.get('/random', wagner.invoke(function (News) {
    return function (req, res) {
      News.aggregate([{$sample: {size: 5}}], function (err, news) {
        if (err) {
          res.json({error: err.toString()})
        }
        res.json({news: news})
      })
    }
  }))

  return api
}
