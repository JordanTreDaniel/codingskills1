import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
// import wordsAPI from './api/words';
import * as passport from 'passport';
import * as session from 'express-session';
import {User, IUser} from './models/Users';
import {Profile, IProfile} from './models/Users';
import gamesAPI from './api/games';
const MongoStore = require('connect-mongo')(session);

let app = express();

//load your env vars
if (app.get('env') === 'development') {
  let dotenv = require('dotenv');
  dotenv.load();
}

//config for passport login
require("./config/passport");

//config req.session your session
app.set('trust proxy', 1); // trust first proxy

//connect to DB
let dbc = mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('connected', () => {
  User.findOne({username: 'admin'}, (err, user) => {
    if(err) return;
    if(user) return;
    if(!user)
      var admin = new User();
      admin.email = process.env.ADMIN_EMAIL;
      admin.username = process.env.ADMIN_USERNAME;
      admin.setPassword(process.env.ADMIN_PASSWORD);
      admin.roles = ['user', 'admin'];
      admin.save();
  });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//STATIC SERVING
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/ngApp', express.static(path.join(__dirname, 'ngApp')));

//API SERVING
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let sess = {
  maxAge: 172800000, // 2 days
  secure: false,
  httpOnly: true
}

if (app.get('env') === 'production') {
  sess.secure = true
}

app.use(session({
  cookie: sess,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGO_URI
  }),
  unset: 'destroy',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('./api/users'));
app.use('/', require('./routes/index'));
app.use('/users', require('./api/users'));


app.use('/api/words', require('./api/words'));
app.use('/api/games', gamesAPI);
// redirect 404 to home for the sake of AngularJS client-side routes
app.get('/*', function(req, res, next) {
  if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
    return next({ status: 404, message: 'Not Found' });
  } else {
    return res.render('index');
  }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, res) => {
    res.status(err['status'] || 500);
    res.render('error', {
      message: err['message'],
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, res, next) => {
  res.status(err['status'] || 500);
  res.render('error', {
    message: err['message'],
    error: {}
  });
});

export = app;
