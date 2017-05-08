var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'risersFallersService'})
var Client = require('node-rest-client').Client
var risersFallersClient = new Client()

function getRisersFallers (RisersFallers, market, cb) {
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

        RisersFallers.findOneAndUpdate(
          {market: market},
          {stocks: stocks},
          {upsert: true, new: true},
          function (err, result) {
            cb(err, result)
          })
      }
    })
}

module.exports = {
  getRisersFallers: getRisersFallers
}
