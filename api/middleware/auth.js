var jwt = require('express-jwt')
var config = require('../../.config')
var secret = process.env.AUTH_CLIENT_SECRET || config.AUTH_CLIENT_SECRET
var audience = process.env.AUTH_CLIENT_ID || config.AUTH_CLIENT_ID

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
