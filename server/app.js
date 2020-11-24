require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var filesRouter = require('./routes/files');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // it enables all cors requests
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/files', filesRouter);

// app.post('/upload', (req, res) => {
//   console.log(req.headers);
//   if (!req.files) {
//     return res.status(500).send({ msg: 'file is not found' });
//   }
//   const myFile = req.files.file;

//   myFile.mv(`${__dirname}/public/upload/${myFile.name}`, function (err) {
//     if (err) {
//       console.log(err);
//       return res.status(500).send({ msg: 'Error occured' });
//     }
//     return res.send({ name: myFile.name, path: `/${myFile.name}` });
//   });
// });

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
