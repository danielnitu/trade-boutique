var express = require('express');
var mongoose = require('mongoose');
var mock = require('./test.mock');
mongoose.Promise = global.Promise;

var User = mongoose.model('User', require('./user'));
var TransactionHistory = mongoose.model('TransactionHistory', require('./transaction_history'), 'transaction_history');

var app = express();

mongoose.connect('mongodb://localhost:27017/test', function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

User.remove(function(err, docs) {
    if (err) throw err;
    console.log('Removed ' + docs + ' documents.');
});

var testUser1 = new User(mock.testUser1);
var testUser2 = new User(mock.testUser2);
var history1 = new TransactionHistory(mock.history1);

history1.save(function(err) {
    if (err) throw err;
    console.log(history1.date);
});

// save user to database
testUser1.save(function(err) {

    if (err) throw err;

    // attempt to authenticate user
    User.authenticate(testUser1.email, 'test1', function(err, user, reason) {

        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            return;
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                console.log('User or password incorrect');
                break;
            case reasons.MAX_ATTEMPTS:
                console.log('Maximum number of attempts reached');
                break;
        }
    });

    // fetch user and test password verification
    User.findOne({ email: 'user1@test.com' }, function(err, user) {

        if (err) throw err;
        // test a matching password
        user.comparePassword('test1', function(err, isMatch) {
            if (err) throw err;
            console.log('test1:', isMatch); // -&gt; Password123: true
        });

        // test a failing password
        user.comparePassword('123Password', function(err, isMatch) {
            if (err) throw err;
            console.log('123Password:', isMatch); // -&gt; 123Password: false
        });

        console.log('User locked: ' + user.isLocked);
        console.log('Funds: ' + user.showFunds('USD'));
        console.log('Funds: ' + user.showFunds('EUR'));
        console.log('Funds: ' + user.showFunds());
    });
});

testUser2.save(function(err) {

    if (err) throw err;

    // attempt to authenticate user
    User.authenticate(testUser2.email, 'test1', function(err, user, reason) {

        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            return;
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                console.log('User or password incorrect');
                break;
            case reasons.MAX_ATTEMPTS:
                console.log('Maximum number of attempts reached');
                break;
        }
    });

    // fetch user and test password verification
    User.findOne({ email: 'user1@test.com' }, function(err, user) {

        if (err) throw err;
        // test a matching password
        user.comparePassword('test1', function(err, isMatch) {
            if (err) throw err;
            console.log('test1:', isMatch); // -&gt; Password123: true
        });

        // test a failing password
        user.comparePassword('123Password', function(err, isMatch) {
            if (err) throw err;
            console.log('123Password:', isMatch); // -&gt; 123Password: false
        });

        console.log('User locked: ' + user.isLocked);
        console.log('Funds: ' + user.showFunds('USD'));
        console.log('Funds: ' + user.showFunds('EUR'));
        console.log('Funds: ' + user.showFunds());
    });
});

app.listen(3000);