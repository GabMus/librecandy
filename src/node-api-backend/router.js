var express = require('express');
var router = express.Router(); // new instance of express router
var models = require('./models/librecandyModels.js');
var auth = require('./auth.js');
var jwt = require('jsonwebtoken');
var config = require('./config.js')

const API_SUCCESS_MSG = {message: 'success', error: null};

function make_user_safe(user) {
    return {
        username: user.username,
        realname: user.realname,
        //avatar: user.avatar, //TODO: implement avatar first
        email: user.email,
        bio: user.bio,
        signup_datetime: user.signup_datetime
    }
}

/*router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'No token provided'
        });
    }
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.json({
                message: 'Failed to authenticate token',
                error: err
            });
        }
        req.decoded = decoded;
        next();
    });
});*/

router.get('/', function(req, res){
    res.json({
        message: 'Welcome to the LibreCandy API v1! RTFM and make a proper request :)'
    });
});

router.route('/authenticate').post(auth.isAuthenticatedBasic, function(req,res) {
    var token = jwt.sign({username: req.user.username}, config.secret, {
        expiresIn: 60*60*24
    });
    res.json({
        success: true,
        message: 'Token created for user ' + req.user.username,
        token: token
    });
});

router.route('/users').post(function(req, res) {
    var user = new models.User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    if (req.body.realname) user.realname = req.body.realname;
    //if (req.body.avatar) user.avatar = req.body.avatar; // TODO: implement avatar loading
    if (req.body.password) user.password = req.body.password;
    if (req.body.bio) user.bio = req.body.bio;

    user.save(function(err) {
        if (err) {
            res.json(err);
            return; //failsafe, dont continue
        }
        res.json(API_SUCCESS_MSG);
    });
}).get(auth.isAuthenticated, function(req, res) {
    // can only use this function as superuser
    if (!req.user.is_superuser) {
        res.status(403);
        res.send('Forbidden');
        return;
    }
    models.User.find(function(err, users){
        if (err) {
            res.json(err);
            return; //failsafe, dont continue
        }
        var safeuser = [];
        for (i in users) {
            safeuser.push(make_user_safe(users[i]));
        }
        res.json(users);
    });
});

router.route('/users/:username').get(function(req, res){
    models.User.findOne({'username': req.params.username}, function(err, user) {
        if (err) {
            res.json(err);
            return;
        }
        res.json(make_user_safe(user));
    });
}).put(auth.isAuthenticated, function(req,res) {
    console.log('       test router put /users/:username ' + req.user.username);
    // if the user making the request isn't the requested user
    if ((req.params.username != req.user.username)) {
        // OR if the user isn't a superuser
        if (!req.user.is_superuser) {
            res.status(403);
            res.send('Forbidden');
            return;
        }
    }
    models.User.findOne({'username': req.params.username}, function(err, user) {
        if (err) {
            res.json(err);
            return;
        }

        if (req.body.realname) {
            user.realname = req.body.realname;
        }
        // if avatar
        if (req.body.bio) {
            user.bio = req.body.bio;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.save(function(err) {
            if (err) {
                res.json(err);
                return; //failsafe, dont continue
            }
            res.json(API_SUCCESS_MSG);
        });
    });
}).delete(auth.isAuthenticated, function(req, res) {
    if ((req.params.username != req.user.username)) {
        // OR if the user isn't a superuser
        if (!req.user.is_superuser) {
            res.status(403);
            res.send('Forbidden');
            return;
        }
    }
    models.User.remove(
        {username: req.params.username},
        function(err, user) {
            if (err) {
                res.json(err);
                return; //failsafe, dont continue
            }
            res.json(API_SUCCESS_MSG);
        }
    );
});

module.exports = router;
