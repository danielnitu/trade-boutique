var mongoose = require('mongoose')

var SymbolDataSchema = new mongoose.Schema({

  symbol: {type: String, required: true, uppercase: true},
  company: {type: String, required: true},
  exchange: {type: String, ref: 'Exchange'},
  yearHigh: {type: Number},
  yearLow: {type: Number},
  marketCap: {type: Number}
})

SymbolDataSchema.index({symbol: 'text'})

module.exports = SymbolDataSchema
