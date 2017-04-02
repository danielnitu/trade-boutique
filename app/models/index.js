var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var _ = require('underscore');

// setup db connection and models dependencies
module.exports = function(wagner) {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', function(err) {
        if (err) throw err;
        console.log('DB connection established');
    });

    wagner.factory('db', function() {
        return mongoose;
    });

    var User = mongoose.model('User', require('./user'), 'users');
    var Transaction = mongoose.model('Transaction', require('./transaction'), 'transactions');
    var Price = mongoose.model('Price', require('./price'), 'prices');
    var SymbolHistory = mongoose.model('SymbolHistory', require('./symbol-history'), 'symbol-history');
    var SymbolData = mongoose.model('SymbolData', require('./symbol-data'), 'symbol-data');
    var News = mongoose.model('News', require('./news'), 'news');

    var models = {
        User: User,
        Transaction: Transaction,
        Price: Price,
        SymbolHistory: SymbolHistory,
        SymbolData: SymbolData,
        News: News
    };

    _.each(models, function(value, key) {
        wagner.factory(key, function() {
            return value;
        });
    });

    return models;

};