var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'risersFallersService'})
var Client = require('node-rest-client').Client
var risersFallersClient = new Client()

function updateRisersFallers (RisersFallers) {
  getRisersFallers(RisersFallers, null, function (err, stocks) {
    if (err) {
      log.info('Error updating RisersFallers -' + err)
    } else {
      log.info('Updated RisersFallers')
    }
  })
}

function getRisersFallers (RisersFallers, market, cb) {
  if (!market) market = 'US'

  var args = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  risersFallersClient.get('https://api.investfly.com/stockmarket/risersfallers?market=' + market,
    args, function (data, res) {
      log.info('Connecting to Investfly Risers Fallers API (market: ' + market + ') - ' + res.statusCode + ' (' + res.statusMessage + ')')

      if (res.statusCode === 200) {
        var stocks = data['risers'].concat(data['fallers'])

        stocks.forEach(function (stock) {
          stock.market = market
        })

        saveRisersFallers(RisersFallers, stocks, market, function (err, stocks) {
          if (err) {
            cb('Error saving results of Risers-Fallers', null)
          }
          cb(null, stocks)
        })
      } else {
        cb('Error getting results of Risers-Fallers', null)
      }
    })
}

function saveRisersFallers (RisersFallers, stocks, market, cb) {
  RisersFallers.remove({market: {$in: market}}, function (err, result) {
    if (err) {
      log.info('Cannot remove data from RisersFallers collection')
    } else {
      try {
        RisersFallers.insertMany(stocks)
        cb(null, stocks)
      } catch (err) {
        log.info('Error inserting RisersFallers records -' + err)
        cb(err, null)
      }
    }
  })
}

module.exports = {
  updateRisersFallers: updateRisersFallers,
  getRisersFallers: getRisersFallers
}
