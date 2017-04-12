var jwt = require('express-jwt')
var config = require('../../.config')
var secret = process.env.authClientSecret || config.authClientSecret
var audience = process.env.authClientId || config.authClientId

module.exports.jwt = jwt({
  secret: new Buffer(secret),
  audience: audience
}).unless({
  path: [/^\/api\/news\/.*/]
})

module.exports.error = function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized - Invalid token')
  }
}
