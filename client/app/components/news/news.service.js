;(function () {
  'use strict'

  angular
    .module('news', [])
    .factory('news', news)

  /* @ngInject */
  function news ($http) {
    return {
      getNews: getNews,
      getRandomNews: getRandomNews,
      shuffleNews: shuffleNews
    }

    function getNews (symbol, cb) {
      $http
        .get('/api/news/symbol/' + symbol)
        .then(function (res) {
          cb(null, res)
        }, function (err) {
          cb(err, null)
        })
    }

    function getRandomNews (cb) {
      $http
        .get('/api/news/random')
        .then(function (res) {
          cb(null, res)
        }, function (err) {
          cb(err, null)
        })
    }

    // Fisher–Yates shuffle algorithm for random news array
    function shuffleNews (array) {
      var m = array.length
      var t
      var i

      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--)

        // And swap it with the current element.
        t = array[m]
        array[m] = array[i]
        array[i] = t
      }

      return array
    }
  }
})()
