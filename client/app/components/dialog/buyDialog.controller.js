;(function () {
  'use strict'

  angular
    .module('app')
    .controller('buyDialogController', buyDialogController)

  function buyDialogController ($rootScope, $mdDialog, price, dialog, profile, passSymbol, passCompany) {
    var vm = this

    vm.stockQuantity = 1
    vm.buyQuantity = 0
    vm.buyPrice = 0
    vm.symbol = passSymbol
    vm.company = passCompany
    vm.loading = false

    vm.closeDialog = dialog.closeDialog
    vm.showToast = dialog.showToast
    vm.buyStock = buyStock

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
      }
    })

    function buyStock (price, quantity) {
      dialog.loading(vm.loading, true)
      vm.buyQuantity = quantity
      vm.buyPrice = (quantity * price).toFixed(2)
      var currQty = vm.user.stock.quantity
      var avgPrice = profile.weightedAverage(vm.user.stock.price, price, currQty, quantity)
      var totalQty = vm.user.stock.quantity + quantity
      var funds = vm.user.funds - ((price * quantity).toFixed(2))

      profile.buyStock(vm.symbol, vm.company, avgPrice, price, totalQty, funds, currQty, function (err, res) {
        dialog.loading(vm.loading, false)
        $rootScope.$broadcast('transaction')

        if (err) {
          vm.error = err
        } else {
          vm.closeDialog()
          vm.showToast('bought', vm.buyQuantity, vm.symbol, (vm.buyPrice.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')))
        }
      })
    }
  }
})()
