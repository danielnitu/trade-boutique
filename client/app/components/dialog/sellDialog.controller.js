;(function () {
  'use strict'

  angular
    .module('app')
    .controller('sellDialogController', sellDialogController)

  /* @ngInject */
  function sellDialogController ($rootScope, price, profile, dialog, passSymbol, passCompany) {
    var vm = this

    vm.symbol = passSymbol
    vm.loading = false

    vm.closeDialog = dialog.closeDialog
    vm.showToast = dialog.showToast
    vm.sellStock = sellStock

    price.getPrice(vm.symbol, null, function (err, res) {
      if (err) {
        vm.error = err
      } else {
        vm.stockPrice = res
      }
    })

    profile.getStockAndFunds(vm.symbol, function (err, data) {
      if (err) {
        vm.error = err
      } else {
        vm.user = data
        vm.stockQuantity = vm.user.stock.quantity
        vm.userStockPrice = vm.user.stock.price
      }
    })

    function sellStock (price, quantity) {
      dialog.loading(vm.loading, true)
      var sellAll = vm.user.stock.quantity - quantity
      var profit = (vm.stockPrice - vm.userStockPrice) * quantity
      profile.sellStock(vm.symbol, passCompany, price, quantity, profit, sellAll, function (err, res) {
        dialog.loading(vm.loading, false)
        $rootScope.$broadcast('transaction')

        if (err) {
          vm.loading = false
          vm.error = err
        } else {
          vm.closeDialog()
          vm.showToast('sold', quantity, vm.symbol, ((price * quantity).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')))
        }
      })
    }
  }
})()
