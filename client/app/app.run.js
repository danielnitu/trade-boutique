;(function () {
  'use strict'

  angular
    .module('app')
    .run(run)

  /* @ngInject */
  function run ($rootScope, $state, auth, store, jwtHelper, $location) {
    $rootScope.$on('$locationChangeStart', function () {
      // Get the JWT that is saved in local storage
      // and if it is there, check whether it is expired.
      // If it isn't, set the user's auth state
      var token = store.get('token')
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            document.body.classList.add('logged-in')
            auth.authenticate(store.get('profile'), token)
          }
        }
      }

      if (!auth.isAuthenticated) {
        $location.path('/welcome')
      }
    })
  }
})()
