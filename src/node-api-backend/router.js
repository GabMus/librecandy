var express = require('express');
var router = express.Router(); // new instance of express router
var models = require('./models/librecandyModels.js')
var bodyParser = require('body-parser');

const API_SUCCESS_MSG = {message: 'success', error: null};

router.use(function(req, res, next) {
    //logging
    console.log('Something happening');
    next();
});

router.get('/', function(req, res){
    res.json({
        message: 'all your base are belong to us!'
    });
});

router.route('/users').post(function(req, res) {
    var user = new models.User();
    user.username = req.body.username;
    user.email = req.body.email;

    user.save(function(err) {
        if (err) {
            res.json(err);
            return; //failsafe, dont continue
        }
        res.json(API_SUCCESS_MSG);
    });
}).get(function(req, res) {
    models.User.find(function(err, users){
        if (err) {
            res.json(err);
            return; //failsafe, dont continue
        }
        res.json(users);
    });
});

router.route('/users/:username').get(function(req, res){
    models.User.find({'username': req.params.username}, function(err, user) {
        if (err) {
            res.json(err);
            return;
        }
        res.json(user);
    });
}).put(function(req,res) {
    models.User.find({'username': req.params.username}, function(err, user) {
        if (err) {
            res.json(err);
            return;
        }

        user = user[0] //User.find returns a list, can't know username is unique

        if (req.body.realname) {
            user.realname = req.body.realname;
        }
        // if avatar
        if (req.body.bio) {
            user.bio = req.body.bio;
        }
        console.log('test');
        console.log(user);
        user.save(function(err) {
            if (err) {
                res.json(err);
                return; //failsafe, dont continue
            }
            res.json(API_SUCCESS_MSG);
        });
    });
}).delete(function(req, res) { // NOTE: VERY UNSAFE, DON'T LEAVE LIKE THIS IN PRODUCTION
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
