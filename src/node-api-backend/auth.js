var models = require('./models/librecandyModels.js');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config.js');

var passport_jwt_options = {};
passport_jwt_options.secretOrKey = config.secret;
passport_jwt_options.jwtFromRequest = ExtractJwt.fromAuthHeader();
// example Auth Header: "Authorization: JWT <token>"
passport_jwt_options.ignoreExpiration = false;
//passport_jwt_options.passReqToCallback = true;

function generate_jwt_token(username) {
    return jwt.sign({username: username, issue_time: Date.now()}, config.secret, {
        expiresIn: 60*60*24*7 // 1 week
    });
}

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

var authenticateBasic = passport.authenticate('basic', {session: false});

passport.use(new JwtStrategy(passport_jwt_options, function(jwt_payload, callback) {
    models.User.findOne({username: jwt_payload.username}, function(err, user) {
        if (err) {
            return callback(err, false);
        }
        if (user) {
            return callback(null, user);
        }
        return callback(null, false);
    });
    return authenticateBasic;
}));

var authenticateJwt = passport.authenticate('jwt', {session: false});

exports.isAuthenticated = authenticateJwt;
exports.isAuthenticatedBasic = authenticateBasic;
exports.generate_jwt_token = generate_jwt_token;
