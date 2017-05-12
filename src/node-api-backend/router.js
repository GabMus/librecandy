var express = require('express');
var router = express.Router(); // new instance of express router

router.get('/', function(req, res){
    res.json({
        message: 'all your base are belong to us!'
    });
});

module.exports = router;
