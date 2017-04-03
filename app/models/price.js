var mongoose = require('mongoose')

var PriceSchema = new mongoose.Schema({

  symbol: {type: String, required: true, uppercase: true},
  price: {type: Number, required: true}

})

PriceSchema.index({symbol: 'text'})

module.exports = PriceSchema
