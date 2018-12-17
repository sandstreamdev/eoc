const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const item = require('./routes/item');
const items = require('./routes/items');
const { DB_URL } = require('./common/variables');
const { authenticate, authenticateCallback } = require('./config/auth');

const app = express();

// Set up mongodb connection
const dbUrl = DB_URL;
mongoose.connect(dbUrl);

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', unset: 'destroy' }));
app.use(bodyParser.urlencoded({ extended: false, credentials: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('../../dist'));

// Endpoint for all operations related with /item
app.use('/item', item);

// Endpoint for all operations with /items
app.use('/items', items);

// Root endpoint
app.get('/', (req, resp) => resp.status(200).send('Hello World'));

app.listen(8080, () => console.info('Listening on port 8080!'));

/**
 * Authentication routes
 */
app.get('/auth/google', authenticate);

app.get('/auth/google/callback', authenticateCallback, (req, res) => {
  req.session.token = req.user.token;

  // Set user cookies
  res.cookie('user_name', req.user.displayName);
  res.cookie('user_id', req.user.id);

  res.redirect('http://localhost:3000/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    req.logout();

    res.clearCookie('connect.sid');
    res.clearCookie('user_name');
    res.clearCookie('user_id');
    res.redirect('http://localhost:3000/');
  });
});
