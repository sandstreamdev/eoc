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
const { Server } = require('http');

const socket = require('./sockets/index');
const { AppConfig, DB_URL } = require('./common/variables');
const authRouter = require('./routes/authorization');
const commentsRouter = require('./routes/comment');
const cohortsRouter = require('./routes/cohort');
const listsRouter = require('./routes/list');
const mailerRouter = require('./routes/mailer');
const activitiesRouter = require('./routes/activity');
const librariesRouter = require('./routes/library');
const unlockLocks = require('./common/utils/unlockLocks');
const runAgenda = require('./tasks/agenda');

const app = express();
const dbUrl = DB_URL;
const server = Server(app);
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, unlockLocks);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.enable(AppConfig.PROXY);
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
app.use('/api/libraries', librariesRouter);
app.use('/api/lists', listsRouter);
app.use('/api', mailerRouter);
app.use('*', (_, res) => res.sendFile(path.resolve('dist/index.html')));
socket.init(server);

const PORT = 8080;

runAgenda();

// eslint-disable-next-line no-console
server.listen(PORT, () => console.info(`EOC server running on port ${PORT}`));
