;(function () {
  'use strict'

  angular
    .module('app')
    .controller('profileController', profileController)

  function profileController ($http, profile) {
    var vm = this

    vm.profile = profile.getProfile()

    profile.getFunds(function (err, funds) {
      if (err) {
        vm.error = err
      } else {
        vm.funds = funds
      }
    })
  }
})()
