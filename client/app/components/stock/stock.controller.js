;(function () {
  'use strict'

  angular
    .module('app')
    .controller('stockController', stockController)

  /* @ngInject */
  function stockController ($stateParams, $http, dialog, price, news, avatar) {
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

            price.getPrice($stateParams.symbol, $stateParams.market || vm.company.market, function (err, res) {
              if (err) {
                vm.error = err
              } else {
                vm.price = res
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

    getData()
  }
})()
