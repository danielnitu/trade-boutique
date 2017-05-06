;(function () {
  'use strict'

  angular
    .module('app')
    .controller('newsController', newsController)

  function newsController ($state, $stateParams, news) {
    var vm = this

    vm.getNews = getNews

    function getNews (symbol) {
      news.getNews(symbol, function (err, res) {
        if (err) {
          vm.error = err
        } else {
          console.log(res)
        }
      })
    }

    function getRandomNews () {
      news.getRandomNews(function (err, res) {
        if (err) {
          vm.error = err
        } else {
          vm.news = []
          res.data.news.forEach(function (item) {
            for (var i = 0; i < 10; i++) {
              vm.news.push(item.news[i])
            }
          })
          news.shuffleNews(vm.news)
        }
      })
    }

    if ($state.current.name === 'news') {
      getRandomNews()
    } else {
      getNews($stateParams.symbol)
    }
  }
})()
