var express = require('express');
var router = express.Router(); // new instance of express router
var models = require('./models/librecandyModels.js')
var bodyParser = require('body-parser');

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
        res.json({message: 'success', error: null});
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
}).put(function(req,res){ //TODO: finish this, this is curerntly wrong
    models.User.find({'username': req.params.username}, function(err, user) {
        if (err) {
            res.json(err);
            return;
        }
        res.json(user);
    });
});

module.exports = router;
