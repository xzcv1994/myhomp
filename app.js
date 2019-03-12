var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var database = require('./database/databse');
var index = require('./routes/index');
var passport = require('passport');
var config = require('./config/config')
var users = require('./routes/users')(passport,app);
var chat = require('./chat/chat2')(app);
var app = express();
var static = require('serve-static');
var configPassport = require('./passport/passport');
var expressSession = require('express-session');
configPassport(app, passport);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(static(path.join(__dirname,'./public2')));
app.use(cors());
app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());

//DB연결함수 호출
database.init(app, config);

app.use('/',index);
app.use('/users', users);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
