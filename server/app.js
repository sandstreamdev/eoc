require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const { DB_URL } = require('./common/variables');

const app = express();

// Set up mongodb connection
const dbUrl = DB_URL;
mongoose.connect(dbUrl);
mongoose.set('useCreateIndex', true);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_KEY,
    unset: 'destroy',
    saveUninitialized: false,
    resave: false
  })
);
app.use(bodyParser.urlencoded({ extended: false, credentials: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('../../dist'));

// Routes handlers
require('./routes/authorization')(app);
require('./routes/shoppingList')(app);
require('./routes/cohort')(app);
require('./routes/item')(app);
require('./routes/items')(app);

// Root endpoint
app.get('/', (req, resp) => resp.status(200).send('Hello World'));

module.exports = app;
