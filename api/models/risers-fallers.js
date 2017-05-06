var mongoose = require('mongoose')

var RisersFallersSchema = new mongoose.Schema({

  symbol: {type: String, required: true, uppercase: true},
  url: {type: String},
  lastPrice: {type: Number, required: true},
  percentChange: {type: Number, required: true},
  marketCap: {type: String},
  company: {type: String, required: true},
  market: {type: String, default: 'US'}
}, {timestamps: true})

module.exports = RisersFallersSchema
