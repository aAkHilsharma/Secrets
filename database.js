const mongoose = require('mongoose');

const connectMongoose = () => {
  mongoose
    .connect('mongodb://127.0.0.1:27017/newUserDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to database successfully');
    })
    .catch((err) => {
      console.log('Error connecting to MongoDB database', err.message);
    });
};

module.exports = { connectMongoose };
