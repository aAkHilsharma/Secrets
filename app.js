// Importing the required and installed modules
require('dotenv').config();
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { connectMongoose } = require('./database');
const userModel = require('./models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// give permission to the app
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'This is the secrect key to encrypt the password and user data.',
    resave: false,
    saveUninitialized: false,
  })
);

// initialize our app with passport and establish a session
app.use(passport.initialize());
app.use(passport.session());

// Connecting MongoDB cluster to our app using the mongoose NPM package
connectMongoose();

// create the stratagy to encrypt the data
passport.use(userModel.createStrategy());
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/secrets',
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      userModel.findOrCreate(
        {
          username: profile.displayName,
          googleId: profile.id,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

// handling the get request
// if user is authenticated then send response message "Authenticated successfullly"
// Othewise redirect user to register page.

app.get('/', function (req, res) {
  res.render('home');
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get(
  '/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  }
);

app.use('/', require('./routes/auth'));

// Allowing the app to listen on port 3000
app.listen(3000, function () {
  console.log('server started successfully');
});
