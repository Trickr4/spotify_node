var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
const cookieParser = require("cookie-parser");
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');

var app = express();

var corsOptions = {
  origin: 'https://spotify-backend-nettsu.herokuapp.com/',
  credentials: true
}

//Specify that connections from localhost:4200 (the client app) are allowed
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "jqSpotifySessionSecretToken",
  saveUninitialized: false,
  resave: false,
  proxy: true,
  cookie: {
    sameSite: true,
    secure: true,
    maxAge: 3600000,
    path: '/'}
                }));

app.use(express.urlencoded({ extended: true }));

//app.use(cookieParser());

app.use('/', indexRouter);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/client'));

app.get('/*', function(req,res) {
    console.log(req)
res.sendFile( path.resolve( 
  path.join(__dirname+'/dist/client')
) );
});

app.get('/artist', function(req,res) {
    console.log(req)
res.sendFile( path.resolve( 
  path.join(__dirname+'/dist/client')
) );
});

app.get('/track', function(req,res) {
    console.log(req)
res.sendFile( path.resolve( 
  path.join(__dirname+'/dist/client')
) );
});

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