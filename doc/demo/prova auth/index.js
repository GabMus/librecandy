//Richiamiamo le librerie
var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    path = require('path'),
    dbConfig = require('./db.js'),
    mongoose = require('mongoose'),
    expressSession = require('express-session');

//Inizializziamo l'app
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Ci connettiamo al DB
mongoose.connect(dbConfig.url);
app.use(expressSession({secret: 'mySecretKey'}));
//Inizializziamo Passport
app.use(passport.initialize());
app.use(passport.session());

//Queste funzioni servono a creare le sessioni per gli utenti
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Creiamo le strategie di login e registrazione
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username },
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false);
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false);
        }
        // User and password both match, return user from
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      User.findOne({'username':username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false);
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.param('email');
          newUser.firstName = req.param('firstName');
          newUser.lastName = req.param('lastName');

          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);
              throw err;
            }
            console.log('User Registration succesful');
            return done(null, newUser);
          });
        }
      });
    };

    // Delay the execution of findOrCreateUser and execute
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
})

//Configuriamo la richiesta POST
app.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/'
  }))

app.listen(8081);
