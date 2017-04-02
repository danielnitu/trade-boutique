exports.testUser1 = {
    email: 'user1@test.com',
    profile: {
        fullName: 'Test User 1',
        picture: 'http://kingofwallpapers.com/picture.html'
    },
    data: {
        funds: [
        {
            currency: 'USD',
            cash: 2500
        },
        {
            currency: 'GBP',
            cash: 7800
        }],
        pass: 'test1',
    },
    stock: [{
        symbol: 'AAPL',
        company: 'Apple Inc.',
        price: 125.26,
        currency: 'USD',
        shares: 20
    }]
};

exports.testUser2 = {
    email: 'test@me.com',
    profile: {
        fullName: 'Test User 2',
        picture: 'http://kingofwallpapers.com/picture.html'
    },
    data: {
        funds: [
        {
            currency: 'USD',
            cash: 2500
        },
        {
            currency: 'GBP',
            cash: 7800
        }],
        pass: 'test1',
    },
    stock: [{
        symbol: 'AAPL',
        company: 'Apple Inc.',
        price: 125.26,
        currency: 'USD',
        shares: 20
    }]
};

exports.history1 = {
    id: 'user1@test.com',
    symbol: 'AAPL',
    company: 'Apple Inc.',
    price: 140.52,
    shares: 20,
    //profit: -350.25,
    currency: 'USD'
};