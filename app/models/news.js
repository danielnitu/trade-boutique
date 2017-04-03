var mongoose = require('mongoose')

var NewsSchema = new mongoose.Schema({

  symbol: {type: String, required: true, uppercase: true},
  news: [{
    title: {type: String, required: true},
    link: {type: String, match: /^(https?:\/\/)/i},
    picture: {type: String, match: /^(https?:\/\/)/i},
    content: {type: String}
  }]
})

NewsSchema.index({symbol: 'text'})

module.exports = NewsSchema
