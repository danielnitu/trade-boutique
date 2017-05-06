;(function () {
  'use strict'

  angular
    .module('app')
    .controller('transactionsController', transactionsController)

  function transactionsController ($http, avatar) {
    var vm = this

    function getTransactions () {
      $http
        .get('/api/transaction/all')
        .then(function (res) {
          if (res.data.error) {
            vm.noTransactions = res.data.error
          } else {
            vm.transactions = res.data.transactions
            avatar.setAvatar(vm.transactions)
          }
        }, function (err) {
          vm.error = err
        })
    }

    getTransactions()
  }
})()
