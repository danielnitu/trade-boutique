var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'priceCronJob'})

var CronJob = require('cron').CronJob
var updatePrices = require('./price').updatePrices

module.exports = function (wagner) {
  // Cron jobs that will start the 'updatePrices' service
  // on every weekday, depending on market opening hours

  /********************************
  US MARKET - OPEN: 14:30-21:00 UTC
  ------runs every 5 minutes-------
  ********************************/
  var intervalUS = new CronJob({
    cronTime: '* */5 * * * *',
    onTick: function () {
      updatePrices(wagner, 'US')
    }
  })

  var startUS = new CronJob({
    cronTime: '00 30 14 * * 1-5',
    onTick: function () {
      intervalUS.start()
      log.info('Update started for market US')
    },
    start: true,
    runOnInit: false
  })

  var stopUS = new CronJob({
    cronTime: '05 00 21 * * 1-5',
    onTick: function () {
      intervalUS.stop()
      log.info('Update stopped for market US')
    },
    start: true,
    runOnInit: false
  })

  /*********************************
  TMX MARKET - OPEN: 14:30-21:00 UTC
  ------runs every 10 minutes-------
  *********************************/
  var intervalTMX = new CronJob({
    cronTime: '* */10 * * * *',
    onTick: function () {
      updatePrices(wagner, 'TMX')
    }
  })

  var startTMX = new CronJob({
    cronTime: '05 30 14 * * 1-5',
    onTick: function () {
      intervalTMX.start()
      log.info('Update started for market TMX')
    },
    start: true,
    runOnInit: false
  })

  var stopTMX = new CronJob({
    cronTime: '10 00 21 * * 1-5',
    onTick: function () {
      intervalTMX.stop()
      log.info('Update stopped for market TMX')
    },
    start: true,
    runOnInit: false
  })

  /*********************************
  LSE MARKET - OPEN: 08:00-16:30 UTC
  ------runs every 5 minutes--------
  *********************************/
  var intervalLSE = new CronJob({
    cronTime: '* */5 * * * *',
    onTick: function () {
      updatePrices(wagner, 'LSE')
    }
  })

  var startLSE = new CronJob({
    cronTime: '10 00 08 * * 1-5',
    onTick: function () {
      intervalLSE.start()
      log.info('Update started for market LSE')
    },
    start: true,
    runOnInit: false
  })

  var stopLSE = new CronJob({
    cronTime: '15 30 16 * * 1-5',
    onTick: function () {
      intervalLSE.stop()
      log.info('Update stopped for market LSE')
    },
    start: true,
    runOnInit: false
  })

  /**********************************
  EURO MARKET - OPEN: 08:00-16:30 UTC
  -------runs every 5 minutes--------
  **********************************/
  var intervalEURO = new CronJob({
    cronTime: '* */5 * * * *',
    onTick: function () {
      updatePrices(wagner, 'EURO')
    }
  })

  var startEURO = new CronJob({
    cronTime: '15 00 08 * * 1-5',
    onTick: function () {
      intervalEURO.start()
      log.info('Update started for market EURO')
    },
    start: true,
    runOnInit: false
  })

  var stopEURO = new CronJob({
    cronTime: '20 30 16 * * 1-5',
    onTick: function () {
      intervalEURO.stop()
      log.info('Update stopped for market EURO')
    },
    start: true,
    runOnInit: false
  })

  /*********************************
  HKE MARKET - OPEN: 01:30-08:00 UTC
  ------runs every 10 minutes-------
  *********************************/
  var intervalHKE = new CronJob({
    cronTime: '* */10 * * * *',
    onTick: function () {
      updatePrices(wagner, 'HKE')
    }
  })

  var startHKE = new CronJob({
    cronTime: '00 30 01 * * 1-5',
    onTick: function () {
      intervalHKE.start()
      log.info('Update started for market HKE')
    },
    start: true,
    runOnInit: false
  })

  var stopHKE = new CronJob({
    cronTime: '05 00 08 * * 1-5',
    onTick: function () {
      intervalHKE.stop()
      log.info('Update stopped for market HKE')
    },
    start: true,
    runOnInit: false
  })

  /***********************************
  INDIA MARKET - OPEN: 03:45-10:00 UTC
  ------runs every 10 minutes-------
  ***********************************/
  var intervalINDIA = new CronJob({
    cronTime: '* */10 * * * *',
    onTick: function () {
      updatePrices(wagner, 'INDIA')
    }
  })

  var startINDIA = new CronJob({
    cronTime: '00 45 03 * * 1-5',
    onTick: function () {
      intervalINDIA.start()
      log.info('Update started for market INDIA')
    },
    start: true,
    runOnInit: false
  })

  var stopINDIA = new CronJob({
    cronTime: '05 00 10 * * 1-5',
    onTick: function () {
      intervalINDIA.stop()
      log.info('Update stopped for market INDIA')
    },
    start: true,
    runOnInit: false
  })
}
