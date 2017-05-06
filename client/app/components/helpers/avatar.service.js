;(function () {
  'use strict'

  angular
    .module('avatar', [])
    .factory('avatar', avatar)

  function avatar () {
    return {
      setAvatar: setAvatar,
      initials: initials
    }

    function setAvatar (stockArray) {
      stockArray.forEach(function (stock) {
        stock.avatar = initials(stock.company)
      })
      return stockArray
    }

    function initials (name) {
      var initials = name.split(' ', 2)
      var avatar = ''
      initials.forEach(function (item) {
        if (item === 'Inc.') {
          return
        }
        avatar += item[0]
      })
      return avatar.toUpperCase()
    }
  }
})()
