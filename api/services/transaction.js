function registerTransaction (Transaction, data) {
  Transaction.create({
    email: data.email,
    symbol: data.symbol,
    company: data.company,
    price: data.price,
    quantity: data.quantity,
    profit: data.profit,
    createdAt: Date.now()
  }, function (err) {
    if (err) {
      console.log(Date.now() + ' - Error storing transaction: ' + err)
    }
  })
}

module.exports = registerTransaction
