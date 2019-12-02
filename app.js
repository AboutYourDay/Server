var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose
    .connect("mongodb://localhost:27017/local", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected successful"))
    .catch(err => console.error(err));

// mongoose
//   .connect(
//     "mongodb+srv://joylish:5h39B6tiikYdd260@cluster0-uyi10.mongodb.net/test?retryWrites=true&w=majority",
//     { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("connected successful"))
//   .catch(err => console.error(err));

var diariesRouter = require('./routes/diary');
var usersRouter = require('./routes/user');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/diaries', diariesRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
