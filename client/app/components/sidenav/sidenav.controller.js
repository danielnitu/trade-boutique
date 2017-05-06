;(function () {
  'use strict'

  angular
    .module('app')
    .controller('sidenavController', sidenavController)

  function sidenavController ($http, $rootScope, $scope, $location, auth, store,
    sidenav, profile) {
    var vm = this

    vm.getNews = getNews
    vm.logout = logout

    vm.closeSidenav = sidenav.closeSidenav
    vm.auth = auth

    vm.message = ''
    vm.sidenavShow = false

    // Keep profile data and sidenav open on page refresh
    // if user is logged in
    if (vm.auth.isAuthenticated) {
      vm.profile = profile.getProfile()
      vm.sidenavShow = true
      getFunds()
    }

    $scope.$on('userLogIn', function () {
      vm.profile = profile.getProfile()
      vm.sidenavShow = true
      getFunds()
    })

    $scope.$on('transaction', function () {
      getFunds()
    })

    function getFunds () {
      profile.getFunds(function (err, funds) {
        if (err) {
          vm.error = err
        }
        vm.funds = funds
      })
    }

    function getNews () {
      $http.get('http://localhost:3000/api/news/AAPL', {
        skipAuthorization: true
      }).then(function (response) {
        vm.message = response.data.news.symbol
      })
    }

    function logout () {
      // The signout method on the auth service
      // sets isAuthenticated to false but we
      // also need to remove the profile and
      // token from local storage
      auth.signout()
      store.remove('profile')
      store.remove('token')
      vm.sidenavShow = false
      document.body.classList.remove('logged-in')
      $rootScope.$broadcast('userLogOut')
      vm.userLogged = false
      $location.path('/home')
    }
  }
})()
