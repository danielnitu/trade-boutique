var moment = require('moment')

var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'priceCronJob'})

var CronJob = require('cron').CronJob
var updatePrices = require('./price').updatePrices

module.exports = function (wagner) {
  // Cron jobs that will start the 'updatePrices' service
  // on every weekday, depending on market opening hours

  var updateFrequencyUS = process.env.UPDATE_FREQUENCY_US || 5
  var updateFrequencyTMX = process.env.UPDATE_FREQUENCY_TMX || 10
  var updateFrequencyLSE = process.env.UPDATE_FREQUENCY_LSE || 5
  var updateFrequencyEURO = process.env.UPDATE_FREQUENCY_EURO || 5
  var updateFrequencyHKE = process.env.UPDATE_FREQUENCY_HKE || 10
  var updateFrequencyINDIA = process.env.UPDATE_FREQUENCY_INDIA || 10

  /********************************
  US MARKET - OPEN: 14:30-21:00 UTC
  ------runs every 5 minutes-------
  ********************************/

  var intervalUS = new CronJob({
    cronTime: '05 */' + updateFrequencyUS + ' * * * *',
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
    cronTime: '10 00 21 * * 1-5',
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
    cronTime: '10 */' + updateFrequencyTMX + ' * * * *',
    onTick: function () {
      updatePrices(wagner, 'TMX')
    }
  })

  var startTMX = new CronJob({
    cronTime: '00 30 14 * * 1-5',
    onTick: function () {
      intervalTMX.start()
      log.info('Update started for market TMX')
    },
    start: true,
    runOnInit: false
  })

  var stopTMX = new CronJob({
    cronTime: '15 00 21 * * 1-5',
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
    cronTime: '15 */' + updateFrequencyLSE + ' * * * *',
    onTick: function () {
      updatePrices(wagner, 'LSE')
    }
  })

  var startLSE = new CronJob({
    cronTime: '00 00 08 * * 1-5',
    onTick: function () {
      intervalLSE.start()
      log.info('Update started for market LSE')
    },
    start: true,
    runOnInit: false
  })

  var stopLSE = new CronJob({
    cronTime: '20 30 16 * * 1-5',
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
    cronTime: '20 */' + updateFrequencyEURO + ' * * * *',
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
    cronTime: '25 30 16 * * 1-5',
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
    cronTime: '05 */' + updateFrequencyHKE + ' * * * *',
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
    cronTime: '10 00 08 * * 1-5',
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
    cronTime: '25 */' + updateFrequencyINDIA + ' * * * *',
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
    cronTime: '30 00 10 * * 1-5',
    onTick: function () {
      intervalINDIA.stop()
      log.info('Update stopped for market INDIA')
    },
    start: true,
    runOnInit: false
  })

  function initOnRestart () {
    var dayOfWeek = Number(moment().day())
    var timeOfDay = moment().format('HHmmss')

    // Check for US and TMX
    if ((dayOfWeek >= 1 && dayOfWeek <= 5) && (timeOfDay > '143000' && timeOfDay < '210000')) {
      intervalUS.start()
      log.info('Update started for market US')

      intervalTMX.start()
      log.info('Update started for market TMX')
    }

    // Check for LSE and EURO
    if ((dayOfWeek >= 1 && dayOfWeek <= 5) && (timeOfDay > '080000' && timeOfDay < '163000')) {
      intervalLSE.start()
      log.info('Update started for market LSE')

      intervalEURO.start()
      log.info('Update started for market EURO')
    }

    // Check for HKE
    if ((dayOfWeek >= 1 && dayOfWeek <= 5) && (timeOfDay > '013000' && timeOfDay < '080000')) {
      intervalHKE.start()
      log.info('Update started for market HKE')
    }

    // Check for INDIA
    if ((dayOfWeek >= 1 && dayOfWeek <= 5) && (timeOfDay > '034500' && timeOfDay < '100000')) {
      intervalINDIA.start()
      log.info('Update started for market INDIA')
    }
  }

  initOnRestart()
}
