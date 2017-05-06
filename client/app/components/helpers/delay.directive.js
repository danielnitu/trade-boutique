;(function () {
  'use strict'

  angular
    .module('app')
    .directive('showWithDelay', showWithDelay)

  // CODE SOURCE: https://codereview.stackexchange.com/questions/62005/show-with-delay-directive
  /* @ngInject */
  function showWithDelay ($timeout) {
    return {
      restrict: 'A',
      link: function ($scope, $element, attrs) {
        $element.addClass('ng-hide')
        $timeout(function () {
          $element.removeClass('ng-hide')
        }, attrs.showWithDelay || 2000)
      }
    }
  }
})()
