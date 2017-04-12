(function () {
  'use strict'

  angular
    .module('authApp', ['auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router'])
    .config(config)
    .run(run)

  function config ($provide, authProvider, $urlRouterProvider, $stateProvider, $httpProvider, jwtOptionsProvider) {
    authProvider.init({
      domain: 'danielnitu.eu.auth0.com',
      clientID: '1gLOvetcrjC9GW2kEeRzEtJRJH700ia6'
    })

    $urlRouterProvider.otherwise('/home')

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/components/home/home.tpl.html'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/components/profile/profile.tpl.html',
        controller: 'profileController as user'
      })

    jwtOptionsProvider.config({
      tokenGetter: ['options', function (options) {
        // Don't send the token for template requests
        if (options.url.substr(options.url.length - 5) === '.html') {
          return null
        }

        var token = window.localStorage.getItem('token')
        return token.slice(1, -1)
      }],
      whiteListedDomains: ['trade.boutique', 'localhost', 'jsonplaceholder.typicode.com']
    })

    function redirect ($q, $injector, $timeout, store, $location) {
      var auth
      $timeout(function () {
        auth = $injector.get('auth')
      })

      return {
        responseError: function (rejection) {
          if (rejection.status === 401) {
            auth.signout()
            store.remove('profile')
            store.remove('token')
            $location.path('/home')
          }
          return $q.reject(rejection)
        }
      }
    }
    $provide.factory('redirect', redirect)
    $httpProvider.interceptors.push('jwtInterceptor')
    $httpProvider.interceptors.push('redirect')
  }

  function run ($rootScope, $state, auth, store, jwtHelper, $location) {
    $rootScope.$on('$locationChangeStart', function () {
      // Get the JWT that is saved in local storage
      // and if it is there, check whether it is expired.
      // If it isn't, set the user's auth state
      var token = store.get('token')
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            auth.authenticate(store.get('profile'), token)
          }
        }
      }

      if (!auth.isAuthenticated) {
        $location.path('/home')
      }
    })
  }
})()
