;(function () {
  'use strict'

  angular
    .module('app')
    .directive('sidenav', sidenav)

  function sidenav () {
    return {
      templateUrl: 'app/components/sidenav/sidenav.template.html',
      controller: 'sidenavController',
      controllerAs: 'sidenav'
    }
  }
})()
