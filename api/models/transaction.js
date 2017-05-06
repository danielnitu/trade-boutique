var mongoose = require('mongoose')

var TransctionSchema = new mongoose.Schema({

  email: {type: String, required: true},
  createdAt: {type: Date, default: Date.now()},
  symbol: {type: String, required: true, uppercase: true},
  company: {type: String},
  price: {type: Number, required: true},
  quantity: {type: Number, required: true},
  profit: {type: Number}
})

TransctionSchema.index({email: 1})

module.exports = TransctionSchema
