;(function () {
  'use strict'

  angular
    .module('app')
    .directive('search', search)

  function search () {
    return {
      templateUrl: 'app/components/search/search.template.html',
      controller: 'searchController',
      controllerAs: 'search'
    }
  }
})()
