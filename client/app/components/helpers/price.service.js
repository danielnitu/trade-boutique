;(function () {
  'use strict'

  angular
    .module('price', [])
    .factory('price', price)

  function price ($http) {
    return {
      getPrice: getPrice,
      getPrices: getPrices
    }

    function getPrice (symbol, market, cb) {
      if (market !== null) {
        $http
          .get('/api/price/' + symbol + '/' + market)
          .then(function (res) {
            return cb(null, res.data.price.price)
          }, function (err) {
            return cb('Error: ' + err.data.error, null)
          })
      } else {
        $http
          .get('/api/price/' + symbol)
          .then(function (res) {
            return cb(null, res.data.price.price)
          }, function (err) {
            return cb('Error: status ' + err.status, null)
          })
      }
    }

    function getPrices (symbols, cb) {
      $http
        .post('/api/price/multiple', symbols)
        .then(function (res) {
          return cb(null, res.data.prices)
        }, function (err) {
          return cb('Error: status ' + err.status, null)
        })
    }
  }
})()
