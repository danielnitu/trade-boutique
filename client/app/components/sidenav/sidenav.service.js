;(function () {
  'use strict'

  angular
    .module('sidenav', [])
    .factory('sidenav', sidenav)

  function sidenav ($mdSidenav, auth, store) {
    return {
      toggleSidenav: toggleSidenav,
      closeSidenav: closeSidenav
    }

    function toggleSidenav (id) {
      $mdSidenav(id || 'left').toggle()
    }

    function closeSidenav (id) {
      $mdSidenav(id || 'left').close()
    }
  }
})()
