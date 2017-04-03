var mongoose = require('mongoose')

var SymbolHistorySchema = new mongoose.Schema({

  symbol: {type: String, required: true, uppercase: true},
  quotes: [{
    date: {type: Date, required: true},
    values: {
      open: Number,
      close: Number,
      high: Number,
      low: Number,
      volume: Number
    }
  }]
})

SymbolHistorySchema.index({symbol: 'text'})

module.exports = SymbolHistorySchema
