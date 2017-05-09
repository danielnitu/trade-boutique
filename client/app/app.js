;(function () {
  'use strict'

  /* @ngInject */
  angular
    .module('app', [
      'auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router', 'ngLetterAvatar',
      'sidenav', 'profile', 'price', 'news', 'avatar'])
    .config(config)
    .run(run)

  /* @ngInject */
  function config (
    $mdThemingProvider,
    $provide,
    authProvider,
    $urlRouterProvider,
    $stateProvider,
    $httpProvider,
    jwtOptionsProvider) {
    authProvider.init({
      domain: 'danielnitu.eu.auth0.com',
      clientID: '1gLOvetcrjC9GW2kEeRzEtJRJH700ia6'
    })

    $urlRouterProvider.otherwise('/welcome')

    $stateProvider
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'app/components/welcome/welcome.template.html',
        controller: 'toolbarController as toolbar'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'app/components/home/home.template.html',
        controller: 'homeController as home'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/components/profile/profile.template.html',
        controller: 'profileController as profile'
      })
      .state('portfolio', {
        url: '/portfolio',
        templateUrl: 'app/components/portfolio/portfolio.template.html',
        controller: 'portfolioController as portfolio'
      })
      .state('stock', {
        url: '/stock/:symbol/:market',
        templateUrl: 'app/components/stock/stock.template.html',
        controller: 'stockController as stock'
      })
      .state('news', {
        url: '/news/:symbol',
        templateUrl: 'app/components/news/news.template.html',
        controller: 'newsController as news'
      })
      .state('transactions', {
        url: '/transactions',
        templateUrl: 'app/components/transactions/transactions.template.html',
        controller: 'transactionsController as transactions'
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

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('grey')
      .warnPalette('red')

    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark()

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
            $location.path('/welcome')
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
