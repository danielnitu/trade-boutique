;(function () {
  'use strict'

  angular
    .module('profile', [])
    .factory('profile', profile)

  function profile ($http) {
    return {
      getUser: getUser,
      getStockAndFunds: getStockAndFunds,
      getProfile: getProfile,
      getFunds: getFunds,
      buyStock: buyStock,
      sellStock: sellStock,
      weightedAverage: weightedAverage
    }

    function getProfile () {
      var userProfile = JSON.parse(window.localStorage.getItem('profile'))

      if (~userProfile.name.indexOf('@')) {
        userProfile.name = userProfile.name.split('@')[0]
      }

      return userProfile
    }

    function getUser (cb) {
      $http
        .get('/api/user/')
        .then(function (res) {
          cb(res.data.user)
        })
    }

    function getFunds (cb) {
      $http
        .get('/api/user/funds/')
        .then(function (res) {
          cb(null, res.data.funds)
        }, function (err) {
          cb('Error: Cannot get funds!' + err, null)
        })
    }

    function getStockAndFunds (symbol, cb) {
      $http
        .get('/api/user/portfolio/' + symbol)
        .then(function (res) {
          var data = {
            stock: res.data.stock,
            funds: res.data.funds
          }
          cb(null, data)
        }, function (err) {
          cb('Error: status' + err.status, null, null)
        })
    }

    function buyStock (symbol, company, avgPrice, price, totalQty, funds, exists, cb) {
      var data = {
        symbol: symbol,
        company: company,
        price: avgPrice,
        buyPrice: price,
        quantity: totalQty,
        funds: funds.toFixed(3),
        exists: exists
      }

      $http
        .post('/api/user/buy', data)
        .then(function (res) {
          cb(null, res)
        }, function (err) {
          cb(err, null)
        })
    }

    function sellStock (symbol, company, sellPrice, quantity, profit, sellAll, cb) {
      var data = {
        symbol: symbol,
        company: company,
        sellPrice: sellPrice,
        quantity: quantity,
        profit: profit,
        sellAll: sellAll
      }

      $http
        .post('api/user/sell', data)
        .then(function (res) {
          cb(null, res)
        }, function (err) {
          console.log(err)
          cb(err, null)
        })
    }

    function weightedAverage (prevPrice, currPrice, prevQty, currQty) {
      return (((prevPrice * prevQty) + (currPrice * currQty)) / (prevQty + currQty)).toFixed(3)
    }
  }
})()
