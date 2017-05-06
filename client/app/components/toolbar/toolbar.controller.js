;(function () {
  'use strict'

  angular
    .module('app')
    .controller('toolbarController', toolbarController)

  function toolbarController (auth, store, $location, $scope, $rootScope, sidenav) {
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
        $location.path('/home')
        document.body.classList.add('logged-in')
        $rootScope.$broadcast('userLogIn')
        vm.userLogged = true
      }, function (error) {
        console.log(error)
      })
    }
  }
})()
