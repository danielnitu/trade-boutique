var moment = require('moment')
var config = require('../../.config')

var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'newsService'})

var Client = require('node-rest-client').Client
var newsClient = new Client()

var YAHOO_NEWS = 'http://finance.yahoo.com/rss/headline?s='

function getNews (symbol, News, cb) {
  newsClient.get(YAHOO_NEWS + symbol, function (data, res) {
    log.info('Connecting to Yahoo News API (' + symbol + '): ' + res.statusCode + ' (' + res.statusMessage + ')')

    if (res.statusCode === 200) {
      var news = []
      var items = data.rss.channel

      // If Yahoo can't find any news for a symbol, save an empty
      // news array for the next 24 hours
      if (!items.item) {
        saveNews(News, symbol, [], function (err, result) {
          if (err) {
            return cb(err, null)
          } else {
            return cb(null, result)
          }
        })
        return
      }

      try {
        for (var i = 0; i < items.item.length; i++) {
          var article = {}
          article.title = xmlSpecialChars(items.item[i].title)
          article.link = xmlSpecialChars(items.item[i].link)
          article.date = xmlSpecialChars(items.item[i].pubDate)
          article.description = xmlSpecialChars(items.item[i].description)

          news.push(article)
        }
        saveNews(News, symbol, news, function (err, result) {
          if (err) {
            cb(err, null)
          } else {
            cb(null, result)
          }
        })
      } catch (err) {
        cb('Yahoo API Error: no news available for this symbol!', null)
      }
    } else {
      // GET NEWS SOMEWHERE ELSE
      var RIVER_NEWS = 'https://api.newsriver.io/v2/search?query=text:'
      var RIVER_NEWS_DATE = moment().subtract(3, 'months').format('YYYY-MM-DD')
      var RIVER_NEWS_PARAMS = ' AND language:en AND discoverDate:[' + RIVER_NEWS_DATE + ' TO *]&sortBy=discoverDate&sortOrder=DESC&limit=10'

      var args = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.RIVER_NEWS_AUTHORIZATION || config.RIVER_NEWS_AUTHORIZATION
        }
      }

      newsClient.get(RIVER_NEWS + symbol + RIVER_NEWS_PARAMS, args, function (data, res) {
        log.info('Connecting to RiverNews API (' + symbol + '): ' + res.statusCode + ' (' + res.statusMessage + ')')

        if (res.statusCode === 200) {
          var news = []
          var items = data

          try {
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
            saveNews(News, symbol, news, function (err, result) {
              if (err) {
                cb(err, null)
              } else {
                cb(null, result)
              }
            })
          } catch (err) {
            cb('Newsriver API Error: no news available for this symbol!', null)
          }
        } else {
          // Modify 'newData' parameter and send back old news or none
          News.findOneAndUpdate(
            {symbol: symbol},
            {newData: false},
            {upsert: true, new: true},
            function (err, result) {
              if (err) {
                cb(err, null)
              } else {
                cb(null, result)
              }
            })
        }
      })
    }
  }).on('error', function (err) {
    cb('Request error: ' + err, null)
  })

  newsClient.on('error', function (err) {
    cb('Error: ' + err, null)
  })
}

function saveNews (News, symbol, newsArray, cb) {
  News.findOneAndUpdate({symbol: symbol}, {
    $set: {
      news: newsArray
    },
    newData: true
  }, {upsert: true, new: true}, function (err, result) {
    if (err) {
      cb(err, null)
    } else {
      cb(null, result)
    }
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
