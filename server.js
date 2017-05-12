/**********************************************
Trade Boutique  Copyright (C) 2017  Daniel Nitu
**********************************************/

var express = require('express')
var cors = require('cors')
var wagner = require('wagner-core')
var compression = require('compression')
var auth = require('./api/middleware/auth')

var port = process.env.PORT || 3000
var ROUTES = './api/routes/'

require('events').EventEmitter.prototype._maxListeners = process.env.MAX_LISTENERS || 20
require('./api/models')(wagner)

var app = express()

app.use(compression())
app.use(cors())

app.use(express.static('./client/'))

app.use(auth.jwt)
app.use(auth.error)
app.use('/api/news', require(ROUTES + 'news')(wagner))
app.use('/api/price', require(ROUTES + 'price')(wagner))
app.use('/api/data', require(ROUTES + 'symbol-data')(wagner))
app.use('/api/user', require(ROUTES + 'user')(wagner))
app.use('/api/transaction', require(ROUTES + 'transaction')(wagner))
app.use('/api/risefall', require(ROUTES + 'risers-fallers')(wagner))

app.listen(port, function () {
  console.log('Server running on port ' + port)
  require('./api/services')(wagner)
})
