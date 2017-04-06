var express = require('express')
var wagner = require('wagner-core')

var ROUTES = './app/routes/'

require('./app/models/index')(wagner)

var app = express()
var port = process.env.PORT || 3000

app.use('/api/news', require(ROUTES + 'news')(wagner))

app.listen(port, function () {
  console.log('Server running on port ' + port)
})
