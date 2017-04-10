var jwt = require('express-jwt')
var config = require('../../.config')
var secret = process.env.authClientSecret || config.authClientSecret
var audience = process.env.authClientId || config.authClientId

module.exports = jwt({
  secret: new Buffer(secret),
  audience: audience
})
