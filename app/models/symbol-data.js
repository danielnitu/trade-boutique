var mongoose = require('mongoose');

var SymbolDataSchema = new mongoose.Schema({

    symbol: {type: String, required: true},
    company: {type: String, required: true},
    yearHigh: {type: Number},
    yearLow: {type: Number},
    marketCap: {type: Number}
});

SymbolDataSchema.index({symbol: 'text'});

module.exports = SymbolDataSchema;