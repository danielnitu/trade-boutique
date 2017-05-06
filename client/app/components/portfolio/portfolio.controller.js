;(function () {
  'use strict'

  angular
    .module('app')
    .controller('portfolioController', portfolioController)

  /* @ngInject */
  function portfolioController ($scope, $http, price, dialog, avatar) {
    var vm = this

    vm.showSell = dialog.showSell
    vm.showBuy = dialog.showBuy
    vm.getPortfolio = getPortfolio

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
            userStock.currPrice = stock.price
            userStock.market = stock.market
          }
        })
      })
      return userPortfolio
    }

    // FIRE TO POPULATE DOM WITH DATA
    getPortfolio()
  }
})()
