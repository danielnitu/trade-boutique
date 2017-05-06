;(function () {
  'use strict'

  angular
    .module('app')
    .directive('toolbar', toolbar)

  function toolbar () {
    return {
      templateUrl: 'app/components/toolbar/toolbar.template.html',
      controller: 'toolbarController',
      controllerAs: 'toolbar'
    }
  }
})()
