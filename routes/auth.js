const router = require('express').Router();
const passport = require('passport');
const userModel = require('../models/User');

router.get('/register', function (req, res) {
  res.render('register');
});

router.get('/secrets', async function (req, res) {
  const secrets = await userModel.find({ secret: { $ne: null } });

  if (secrets) {
    res.render('secrets', { users: secrets });
  } else {
    res.render('secrets');
  }
});

// If user is authenticated then send response, othewise redirect to login route
router.get('/login', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/secrets');
  } else {
    res.render('login');
  }
});

router.get('/submit', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('submit');
  } else {
    res.redirect('/login');
  }
});

router.post('/submit', async function (req, res) {
  const { secret } = req.body;

  const user = await userModel.findById(req.user.id);
  if (!user) {
    res.redirect('/register');
  } else {
    user.secret = secret;
    await user.save();
    res.redirect('/secrets');
  }
});

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

/* Registering the user for the first time
handling the post request on /register route.*/

router.post('/register', function (req, res) {
  userModel.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (!err) {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/secrets');
        });
      } else {
        res.send(err.message);
      }
    }
  );
});

// Handling the post request on /login route

router.post('/login', function (req, res) {
  const user = new userModel({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/secrets');
      });
    }
  });
});

module.exports = router;
