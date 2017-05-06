;(function () {
  'use strict'

  angular
    .module('app')
    .factory('dialog', dialog)

  /* @ngInject */
  function dialog ($mdDialog, $mdToast, $timeout) {
    return {
      showBuy: showBuy,
      showSell: showSell,
      closeDialog: closeDialog,
      showToast: showToast,
      loading: loading
    }

    function showBuy ($event, passSymbol, passCompany) {
      $mdDialog.show({
        locals: {passSymbol: passSymbol, passCompany: passCompany},
        controller: 'buyDialogController',
        controllerAs: 'buyDialog',
        templateUrl: 'app/components/dialog/buyDialog.template.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose: true,
        focusOnOpen: false
      })
    }

    function showSell ($event, passSymbol, passCompany) {
      $mdDialog.show({
        locals: {passSymbol: passSymbol, passCompany: passCompany},
        controller: 'sellDialogController',
        controllerAs: 'sellDialog',
        templateUrl: 'app/components/dialog/sellDialog.template.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose: true,
        focusOnOpen: false
      })
    }

    function showToast (action, quantity, symbol, price) {
      $mdToast.show(
        $mdToast
          .simple()
          .textContent('You ' + action + ' ' + quantity + ' ' + symbol + ' shares for $' + price)
          .position('bottom right')
          .hideDelay(5000)
          .toastClass('bs-toast'))
    }

    function closeDialog () {
      $mdDialog.hide()
    }

    function loading (loading, value, timeout) {
      $timeout(function () {
        loading = value
      }, timeout || 500)
    }
  }
})()
