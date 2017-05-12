;(function () {
  'use strict'

  angular
    .module('app')
    .controller('portfolioController', portfolioController)

  /* @ngInject */
  function portfolioController ($scope, $interval, $http, price, dialog, avatar) {
    var vm = this

    vm.showSell = dialog.showSell
    vm.showBuy = dialog.showBuy
    vm.getPortfolio = getPortfolio
    vm.portfolio = null

    $scope.$on('transaction', function () {
      getPortfolio()
    })

    function getPortfolio () {
      $http
        .get('/api/user/portfolio')
        .then(function (res) {
          if (res.data.message) {
            vm.noPortfolio = res.data.message
          } else {
            vm.portfolio = res.data.portfolio
            vm.funds = res.data.funds
            getPrices(vm.portfolio)
            avatar.setAvatar(vm.portfolio)
          }
        })
    }

    function getPrices (portfolio) {
      var symbols = []
      portfolio.forEach(function (stock) {
        symbols.push(stock.symbol)
      })
      price.getPrices(symbols, function (err, res) {
        if (err) {
          vm.error = err
        } else {
          matchPrices(vm.portfolio, res)
        }
      })
    }

    function matchPrices (userPortfolio, currPrices) {
      userPortfolio.forEach(function (userStock) {
        currPrices.forEach(function (stock) {
          if (stock.symbol === userStock.symbol) {
            userStock.updatedAt = stock.updatedAt
            userStock.currPrice = stock.price
            userStock.market = stock.market
          }
        })
      })
      return userPortfolio
    }

    // Sets interval of 5 minutes for auto-updating prices on UI
    // Stops interval after 50 minutes
    var updatePrice
    function autoupdate () {
      updatePrice = $interval(function () {
        getPrices(vm.portfolio)
        console.log('Update of portfolio prices')
      }, 1000 * 60 * 5, 10)
    }

    $scope.$on('$destroy', function () {
      $interval.cancel(updatePrice)
      updatePrice = undefined
    })

    // Fire to populate DOM with data
    getPortfolio()

    // Fire to start update of prices every 5 minutes
    autoupdate()
  }
})()
