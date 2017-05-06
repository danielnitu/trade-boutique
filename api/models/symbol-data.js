var mongoose = require('mongoose')

var SymbolDataSchema = new mongoose.Schema({

  symbol: {type: String, required: true, uppercase: true},
  company: {type: String, required: true},
  market: {type: String},
  yearHigh: {type: Number},
  yearLow: {type: Number},
  marketCap: {type: String},
  EPSEstNextQt: {type: Number},
  EBITDA: {type: String},
  PERatio: {type: Number},
  dividendPayDate: {type: String}
}, {timestamps: true})

SymbolDataSchema.index({symbol: 1})

module.exports = SymbolDataSchema
