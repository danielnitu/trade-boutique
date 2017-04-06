var moment = require('moment')
var Client = require('node-rest-client').Client
var newsClient = new Client()

var YAHOO_NEWS = 'http://finance.yahoo.com/rss/headline?s='

/*
var wagner = require('wagner-core')
require('../models/index')(wagner).News
var News = wagner.invoke(function (News) {
  return News
})
*/

function getNews (symbol, News) {
  newsClient.get(YAHOO_NEWS + symbol, function (data, res) {
    console.log(moment().format() + ' - Connecting to Yahoo News API: ' + res.statusCode + ' (' + res.statusMessage + ')')

    if (res.statusCode === 200) {
      var news = []
      var items = data.channel.item

      for (var i = 0; i < items.length; i++) {
        var article = {}
        article.title = xmlSpecialChars(items[i].title)
        article.link = xmlSpecialChars(items[i].link)
        article.date = xmlSpecialChars(items[i].pubDate)
        article.description = xmlSpecialChars(items[i].description)

        news.push(article)
      }

      saveNews(News, symbol, news)
    } else {
      // GET NEWS SOMEWHERE ELSE

      var RIVER_NEWS = 'https://api.newsriver.io/v2/search?query=text:'
      var RIVER_NEWS_DATE = moment().subtract(3, 'months').format('YYYY-MM-DD')
      var RIVER_NEWS_PARAMS = ' AND language:en AND discoverDate:[' + RIVER_NEWS_DATE + ' TO *]&sortBy=discoverDate&sortOrder=DESC&limit=10'

      var args = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'sBBqsGXiYgF0Db5OV5tAwznjvBUFuRuj2WWQu-CUf-tvRxOHy1Gf9cz377XE8Wcr'
        }
      }

      newsClient.get(RIVER_NEWS + symbol + RIVER_NEWS_PARAMS, args, function (data, res) {
        console.log(moment().format() + ' - Connecting to Newsriver API: ' + res.statusCode + ' (' + res.statusMessage + ')')
        if (res.statusCode === 200) {
          var news = []
          var items = data

          for (var i = 0; i < items.length; i++) {
            var article = {}
            article.title = items[i].title
            article.link = items[i].url
            article.date = items[i].publishDate
            article.description = items[i].text.slice(0, 300)

            // TRY TO FIND AN ARTICLE PICTURE
            var picture = (items[i].hasOwnProperty('elements')) ? items[i].elements : null
            article.picture = (picture.length > 0 && picture[0].hasOwnProperty('url')) ? picture[0].url : null

            news.push(article)
          }

          saveNews(News, symbol, news)
        } else {
          // LOG ERROR MESSAGE

          console.log('News service not available: ' + res.statusCode + '-' + res.statusMessage)
        }
      })
    }
  })
}

function saveNews (News, symbol, newsArray) {
  News.findOneAndUpdate({symbol: symbol}, {
    $set: {
      news: newsArray
    }
  }, {upsert: true}, function (err, result) {
    if (err) throw err
    console.log('Success!')
  })
}

// YAHOO IS STUPID SOMETIMES
function xmlSpecialChars (unsafe) {
  return unsafe
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

module.exports = getNews
