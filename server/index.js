require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo')(session);

const { DB_URL } = require('./common/variables');
const authRouter = require('./routes/authorization');
const commentsRouter = require('./routes/comment');
const cohortsRouter = require('./routes/cohort');
const listsRouter = require('./routes/list');
const mailerRouter = require('./routes/mailer');
const activitiesRouter = require('./routes/activity');

const app = express();
/* eslint-disable import/order */
const server = require('http').Server(app);
const socketListenTo = require('./sockets/index');

socketListenTo(server);

/* eslint-enable import/order */
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
});
// Set up mongodb connection
const dbUrl = DB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_KEY,
    store: sessionStore,
    unset: 'destroy',
    saveUninitialized: false,
    resave: false
  })
);
app.use(bodyParser.urlencoded({ extended: false, credentials: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve('dist')));

app.use('/auth', authRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/cohorts', cohortsRouter);
app.use('/api/lists', listsRouter);
app.use('/api', mailerRouter);
app.use('*', (_, res) => res.sendFile(path.resolve('dist/index.html')));

const PORT = 8080;

// eslint-disable-next-line no-console
server.listen(PORT, () => console.info(`EOC server running on port ${PORT}`));
