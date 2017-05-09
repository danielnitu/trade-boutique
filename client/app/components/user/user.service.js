;(function () {
  'use strict'

  angular
    .module('user', [])
    .factory('user', user)

  function user (auth, store, $location, $scope, $rootScope, sidenav) {
    return {
      login: login
    }

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
      }, function (error) {
        console.log(error)
      })
    }
  }
})()
