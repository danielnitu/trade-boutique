var mongoose = require('mongoose')

var RisersFallersSchema = new mongoose.Schema({

  market: {type: String, required: true},
  newData: {type: Boolean},
  stocks: [{
    symbol: {type: String, required: true, uppercase: true},
    url: {type: String},
    lastPrice: {type: Number, required: true},
    percentChange: {type: Number, required: true},
    marketCap: {type: String},
    company: {type: String, required: true}
  }]
}, {timestamps: true})

module.exports = RisersFallersSchema
