//Richiamiamo le librerie
var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

//Inizializziamo l'app
var app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

//Instanziamo una strategia
passport.use(new LocalStrategy(
  function(username, password, done) {
    debug("Authenticating ",username,",",password);
    if ((username === "sa") && (password == "nopassword")) {
      var user = {
        username : "ted",
        firstName : "Ted",
        lastName : "Neward",
        id : 1
      };
      return done(null, user);
    }
    else {
      return done(null, false, { message: "DENIED"} );
    }
  }
));

//Queste funzioni vengono usate per seralizzare un utente in una sessione e per deserializzare un id da una sessione ed estrapolare l'utente
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Configuriamo la richiesta POST
app.post('/login',
          passport.authenticate('local', { successRedirect: '/',
                                           failureRedirect: '/login',
                                           failureFlash: true })
);
