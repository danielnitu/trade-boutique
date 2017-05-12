;(function () {
  'use strict'

  angular
    .module('app')
    .controller('stockController', stockController)

  /* @ngInject */
  function stockController ($interval, $scope, $stateParams, $http, dialog, price, news, avatar) {
    var vm = this

    vm.loading = false

    vm.showBuy = dialog.showBuy
    vm.showSell = dialog.showSell

    function getData () {
      vm.loading = true

      $http
        .get('/api/data/symbol/' + $stateParams.symbol + '/' + $stateParams.market)
        .then(function (res) {
          if (res.data.error) {
            vm.noCompany = res.data.error
            vm.loading = false
          } else {
            vm.company = res.data.data

            if (vm.company.newData === false) {
              vm.oldData = 'External API not available at this moment. Showing symbol data older than 1 day.'
            }

            price.getPrice($stateParams.symbol, $stateParams.market || vm.company.market, function (err, res) {
              if (err) {
                vm.error = err
              } else {
                vm.price = res.price
                vm.updatedAt = res.updatedAt
              }
            })

            news.getNews($stateParams.symbol, function (err, res) {
              if (err) {
                vm.newsError = 'Error getting news'
              } else {
                try {
                  vm.news = res.data.news.news
                } catch (err) {
                  vm.newsError = err
                }
              }
              vm.loading = false
            })

            vm.avatar = avatar.initials(vm.company.company || $stateParams.symbol)
          }
        })
    }

    // Sets interval of 5 minutes for auto-updating stock price on UI
    // Stops interval after 50 minutes
    var updatePrice
    function autoupdate () {
      updatePrice = $interval(function () {
        price.getPrice($stateParams.symbol, $stateParams.market || vm.company.market, function (err, res) {
          if (err) {
            vm.error = err
          } else {
            vm.price = res
            console.log('Price updated for ' + $stateParams.symbol + ' / ' + $stateParams.market || vm.company.market)
          }
        })
      }, 1000 * 60 * 5, 10)
    }

    $scope.$on('$destroy', function () {
      $interval.cancel(updatePrice)
      updatePrice = undefined
    })

    // Fire to populate DOM with data
    getData()

    // Fire to start auto-update interval
    autoupdate()
  }
})()
