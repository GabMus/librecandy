// Node entry point

// constants
const MONGODB_URI='mongodb://localhost:27017/node-api-backend';

// import libs
var express = require('express');
var bodyParser = require('body-parser');
var router = require('./router');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
// var models = require('./models/librecandyModels.js') // already in router

var app = express(); // create express app

// connect mongoose to the mongo database
// NOTE: to start the mongo DB daemon run:
// mongod --dbpath=dbdir/data --port 27017
mongoose.connect(MONGODB_URI);

// tell app to use bodyParser
// this will enable us to parse the POST data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// use morgan to log requests to the console
// when in production, redirect the log to the log server
app.use(morgan('dev'));

// use passport for authentication
app.use(passport.initialize());

var port = process.env.PORT || 8080; // set port. TODO: change in production?

// router in separate file
// tell the server to answer to addresses starting with /api/v1 with the router definitions (see ./router.js)
app.use('/api/v1', router);

app.listen(port);
console.log('Express server active on port ' + port);
