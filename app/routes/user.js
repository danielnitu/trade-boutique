var express = require('express')
var bodyparser = require('body-parser')

module.exports = function (wagner) {
  var api = express.Router()

  api.use(bodyparser.json())

  api.get()
}