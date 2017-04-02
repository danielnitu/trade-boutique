var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), function () {
  console.log('Server running on port ' + app.get('port'))
})
