;(function () {
  'use strict'

  angular
    .module('app')
    .controller('homeController', homeController)

  function homeController ($http, avatar, dialog) {
    var vm = this

    vm.markets = ['US', 'LSE', 'EURO', 'TMX', 'HKE', 'INDIA']
    vm.loading = false

    vm.showSell = dialog.showSell
    vm.showBuy = dialog.showBuy
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
              vm.stocks = res.data.stocks.stocks
              avatar.setAvatar(vm.stocks)
              vm.loading = false
              if (res.data.stocks.newData === false) {
                vm.message = 'External API not available at this moment. Showing data older than 1 hour.'
              }
            }
          })
      } else {
        vm.error = 'No such market: ' + market
      }
    }
  }
})()
