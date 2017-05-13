var models = require('./models/librecandyModels.js');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
    function(username, password, callback) {
        models.User.findOne({username: username}, function(err, user) {
            if (err) return callback(err);

            // if no user with that username
            if (!user) return callback(null, false);

            // check the password
            user.verifyPassword(password, function(err, isMatch) {
                if (err) return callback(err);
                // wrong password
                if (!isMatch) return callback(null, false);
                // success
                return callback(null, user);
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate('basic', {session: false});
