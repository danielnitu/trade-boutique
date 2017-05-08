var mongoose = require('mongoose')

var SymbolDataSchema = new mongoose.Schema({

  symbol: {type: String, required: true, uppercase: true},
  company: {type: String, required: true},
  market: {type: String},
  exchange: {type: String},
  sector: {type: String},
  industry: {type: String},
  high52Week: {type: Number},
  low52Week: {type: Number},
  marketCap: {type: String},
  eps: {type: Number},
  ebitda: {type: Number},
  peRatio: {type: Number},
  returnOnEquity: {type: Number},
  revenue: {type: Number},
  netIncome: {type: Number},
  grossProfit: {type: Number},
  dividendYield: {type: Number}
}, {timestamps: true})

SymbolDataSchema.index({symbol: 1})

module.exports = SymbolDataSchema
