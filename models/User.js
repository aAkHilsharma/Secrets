const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  googleId: String,
  secret: String,
});

// code to use the Mongoose schema named user with passport
user.plugin(passportLocalMongoose);
user.plugin(findOrCreate);

module.exports = userModel = new mongoose.model('User', user);
