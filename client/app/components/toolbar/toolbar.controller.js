;(function () {
  'use strict'

  angular
    .module('app')
    .controller('toolbarController', toolbarController)

  function toolbarController (auth, store, $location, $scope, $rootScope, $http, sidenav) {
    var vm = this

    vm.login = login

    vm.auth = auth
    vm.toggleSidenav = sidenav.toggleSidenav
    vm.userLogged = false

    if (auth.isAuthenticated) {
      vm.userLogged = true
    }

    $scope.$on('userLogOut', function () {
      vm.userLogged = false
    })

    $scope.$on('userLogIn', function () {
      vm.userLogged = true
    })

    function login () {
      // The auth service has a signin method that
      // makes use of Auth0Lock. If authentication
      // is successful, the user's profile and token
      // are saved in local storage with the store service

      auth.signin({
        authParams: {
          scope: 'openid email'
        }
      }, function (profile, token) {
        store.set('profile', profile)
        store.set('token', token)
        $location.path('/welcome')
        document.body.classList.add('logged-in')
        userAccount(function (res) {
          vm.message = res.data.message
          vm.funds = res.data.user.funds
          vm.userLogged = true
          $rootScope.$broadcast('userLogIn')
        })
      }, function (error) {
        console.log(error)
      })
    }

    function userAccount (cb) {
      $http
        .get('api/user/')
        .then(function (res) {
          cb(res)
        })
    }

    vm.features = [
      '$100,000 starting funds',
      'Real-time stock prices',
      'Six international stock markets',
      'Stock risers and fallers',
      'Daily news for market companies',
      'Up-to-date company data',
      'User-friendly interface'
    ]
  }
})()
