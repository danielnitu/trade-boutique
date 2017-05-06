var mongoose = require('mongoose')

var PriceSchema = new mongoose.Schema({

  symbol: {type: String, required: true, uppercase: true},
  price: {type: Number, required: true},
  market: {type: String, required: true}

}, {timestamps: true})

PriceSchema.index({symbol: 1})

module.exports = PriceSchema
