var mongoose = require('mongoose')
// var currencyFormatter = require('currency-formatter');

var TransctionSchema = new mongoose.Schema({

  id: {type: String, required: true},
  createdAt: {type: Date, default: Date.now()},
  symbol: {type: String, required: true},
  company: {type: String},
  price: {type: Number, required: true},
  shares: {type: Number, required: true},
  profit: {type: Number},
  currency: {type: String, default: 'USD'}
})

/*
TransctionHistorySchema.virtual('PL').get(function() {
    return currencyFormatter.format(this.profit, {code: this.currency});
});

TransctionHistorySchema.virtual('date').get(function() {
    return this.createdAt.toLocaleString({}, {hour12: false});
});

TransctionHistorySchema.set('toObject', { virtuals: true });
TransctionHistorySchema.set('toJSON', { virtuals: true });
*/

module.exports = TransctionSchema
