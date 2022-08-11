var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MONGODB!")
  }).catch((error) => {
    console.log("Error", error)
  })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/usersRouter');
var portfolioItemsRouter = require('./routes/portfolioItems/portfolioItemsRouter')
const AuthorizationService = require('./utils/AuthorizationService');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//! if no argument pass then it allows every domain to acces this server by default
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(AuthorizationService.checkAuth);


app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/portfolioItems', portfolioItemsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
