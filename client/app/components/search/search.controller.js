;(function () {
  'use strict'

  angular
    .module('app')
    .controller('searchController', searchController)

  /* @ngInject */
  function searchController ($http, $state) {
    var vm = this

    vm.queryStock = queryStock
    vm.getData = getData

    function queryStock (stock) {
      return $http
        .get('/api/data/symbols/' + stock)
        .then(function (res) {
          var results = []

          res.data.data.forEach(function (item) {
            results.push(item.symbol)
          })

          return results
        })
    }

    function getData (item) {
      if (!item) {
        return false
      }
      $state.transitionTo('stock', {symbol: item})
    }
  }
})()
