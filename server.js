var express = require('express')
var cors = require('cors')
var wagner = require('wagner-core')
var auth = require('./app/middleware/auth')

var port = process.env.PORT || 3000
var ROUTES = './app/routes/'

require('./app/models')(wagner)

var app = express()

app.use(cors())

app.use('/api/news', require(ROUTES + 'news')(wagner))
app.use(auth)
app.use('/api/price', require(ROUTES + 'price')(wagner))
app.use('/api/data', require(ROUTES + 'symbol-data')(wagner))

app.listen(port, function () {
  console.log('Server running on port ' + port)
})
