var mongoose = require('mongoose');
var DB_URI = '127.0.0.1:12345/test';

mongoose.connect(DB_URI);
mongoose.connection.on('connected', function () {
  console.log('mongoose connection open to ' + DB_URI);
});

mongoose.connection.on('error', function (err) {
  console.log('mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', function () {
  console.log('mongoose connection disconnected');
});
