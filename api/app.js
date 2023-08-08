//api/app.js
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");//載入跨域套件

const indexRouter = require('./routes/index');

// var raccoonAPI = require("./routes/raccoonAPI");
// var ckanAPI = require("./routes/ckanAPI");
// var doc = require("./routes/doc")

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());//跨網
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//ckan
// app.use("/ckanAPI", ckanAPI);
require("./routes/ckanAPIroutes")(app);
//raccoon
// app.use("/raccoonAPI", raccoonAPI);
require("./routes/raccoonAPIroutes")(app);
//Mongo
// app.use("/document", doc);
// require("./routes/mongoAPIroutes")(app);

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
