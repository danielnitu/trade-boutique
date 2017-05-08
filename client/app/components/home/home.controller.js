;(function () {
  'use strict'

  angular
    .module('app')
    .controller('homeController', homeController)

  function homeController ($http, avatar) {
    var vm = this

    // market INDIA also available but API can't find any data
    vm.markets = ['US', 'LSE', 'EURO', 'TMX', 'HKE']
    vm.loading = false

    vm.getRisersFallers = getRisersFallers

    getRisersFallers('US')

    function getRisersFallers (market) {
      vm.loading = true

      if (vm['markets'].includes(market)) {
        $http
          .get('/api/risefall/' + market)
          .then(function (res) {
            if (res.data.error) {
              vm.error = res.data.error
            } else {
              vm.error = null
              vm.stocks = res.data.stocks
              avatar.setAvatar(vm.stocks)
              vm.loading = false
            }
          })
      } else {
        vm.error = 'No such market: ' + market
      }
    }
  }
})()
