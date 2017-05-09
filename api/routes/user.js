var express = require('express')
var moment = require('moment')
var bodyparser = require('body-parser')
var registerTransaction = require('../services/transaction')

module.exports = function (wagner) {
  var api = express.Router()

  api.use(bodyparser.json())
  api.use(bodyparser.urlencoded({extended: true}))

  // CHECK FOR USER PROFILE (ADD USER TO DB IF !USER)
  api.get('/', wagner.invoke(function (User) {
    return function (req, res) {
      User.findOne({email: req.user.email}, function (err, user) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }

        var newMessage = 'Welcome to Trade Boutique! \n Your account has been created.'
        var existingMessage = 'Welcome back!'
        var errorMessage = 'There was an error creating your account! \n Please try again. \n'

        if (!user) {
          var newUser = new User({
            email: req.user.email,
            funds: 100000
          })

          newUser.save(function (err, user) {
            if (err) {
              return res.json({message: errorMessage + err})
            }
            console.log(moment().format() + ' - New user created: ' + user.email)
            return res.json({user: user, message: newMessage})
          })
        } else {
          res.json({user: user, message: existingMessage})
        }
      })
    }
  }))

  // GET USER FUNDS
  api.get('/funds', wagner.invoke(function (User) {
    return function (req, res) {
      User.findOne({email: req.user.email}, function (err, user) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }
        res.json({funds: user.funds})
      })
    }
  }))

  // GET USER PORTFOLIO
  api.get('/portfolio', wagner.invoke(function (User) {
    return function (req, res) {
      User.findOne({email: req.user.email}, function (err, user) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }

        if (user.portfolio.length < 1) {
          return res.json({message: 'You have no stocks in your portfolio.'})
        }

        res.json({
          portfolio: user.portfolio,
          funds: user.funds
        })
      })
    }
  }))

  // GET ONE SYMBOL FROM THE USER'S PORTFOLIO
  api.get('/portfolio/:symbol', wagner.invoke(function (User) {
    return function (req, res) {
      User.findOne({email: req.user.email}, function (err, user) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }

        var response = {
          funds: user.funds,
          stock: {
            symbol: req.params.symbol,
            quantity: 0,
            price: 0
          }
        }

        if (user.portfolio.length > 0) {
          user.portfolio.forEach(function (item) {
            if (item.symbol === req.params.symbol) {
              response.stock.quantity = item.quantity
              response.stock.price = item.price
            }
          })
        }

        res.json({
          funds: response.funds,
          stock: response.stock
        })
      })
    }
  }))

  // BUY STOCK (UPDATE IF STOCK IS IN PORTFOLIO OR CREATE NEW ENTRY)
  api.post('/buy', wagner.invoke(function (User, Transaction) {
    return function (req, res) {
      var transactionData = {
        email: req.user.email,
        symbol: req.body.symbol,
        company: req.body.company,
        price: req.body.buyPrice,
        quantity: req.body.quantity - req.body.exists
      }

      if (req.body.exists > 0) {
        User.findOneAndUpdate(
          {
            email: req.user.email,
            'portfolio.symbol': req.body.symbol
          },
          {
            $set:
            {
              funds: req.body.funds,
              'portfolio.$.company': req.body.company,
              'portfolio.$.price': req.body.price,
              'portfolio.$.quantity': req.body.quantity,
              'portfolio.$.modified': Date.now()
            }
          },
          {new: true},
          function (err, user) {
            if (err) {
              console.log(err.toString())
              return res
                .status(500)
                .json({error: err.toString()})
            }

            res.json({
              funds: user.funds,
              message: 'Successful transaction!'
            })
          })
      } else {
        User.findOneAndUpdate(
          {
            email: req.user.email
          },
          {
            $set: {funds: req.body.funds},
            $push: {portfolio: {
              symbol: req.body.symbol,
              company: req.body.company,
              price: req.body.price,
              quantity: req.body.quantity
            }}
          },
          {new: true},
          function (err, user) {
            if (err) {
              return res
                .status(500)
                .json({error: err.toString()})
            }

            res.json({
              funds: user.funds,
              message: 'Successful transaction!'
            })
          })
      }
      registerTransaction(Transaction, transactionData)
    }
  }))

  // SELL STOCK (REMOVE FROM PORTFOLIO IF USER SELLS ALL SHARES)
  api.post('/sell', wagner.invoke(function (User, Transaction) {
    return function (req, res) {
      var transactionData = {
        email: req.user.email,
        symbol: req.body.symbol,
        company: req.body.company,
        price: req.body.sellPrice,
        quantity: -req.body.quantity,
        profit: req.body.profit
      }

      var transactionPrice = (req.body.sellPrice * req.body.quantity).toFixed(3)
      if (req.body.sellAll === 0) {
        User.findOneAndUpdate(
          {
            'email': req.user.email,
            'portfolio.symbol': req.body.symbol
          },
          {
            $inc: {'funds': transactionPrice},
            $pull: {'portfolio': {'symbol': req.body.symbol}}
          },
        {new: true},
        function (err, user) {
          if (err) {
            return res
              .status(500)
              .json({error: err})
          }

          res.json({
            funds: user.funds.toFixed(3),
            message: 'Successful transaction!'
          })
        })
      } else {
        User.findOneAndUpdate(
          {
            'email': req.user.email,
            'portfolio.symbol': req.body.symbol
          },
          {
            $inc:
            {
              'funds': transactionPrice,
              'portfolio.$.quantity': -req.body.quantity
            },
            $set: {'portfolio.$.modified': Date.now()}
          },
        {new: true},
        function (err, user) {
          if (err) {
            return res
              .status(500)
              .json({error: err})
          }

          res.json({
            funds: user.funds.toFixed(3),
            message: 'Successful transaction!'
          })
        })
      }
      registerTransaction(Transaction, transactionData)
    }
  }))

  return api
}
