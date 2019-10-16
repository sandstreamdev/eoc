const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;

const { createDemoUser } = require('../seed/demoSeed/generateUsers');
const { seedDemoData } = require('../seed/demoSeed/seedDemoData');
const {
  extractUserProfile,
  findAndAuthenticateUser,
  findOrCreateUser
} = require('../common/utils/userUtils');
const User = require('../models/user.model');
const { DEMO_MODE_ID } = require('../common/variables');

const StrategyType = Object.freeze({
  DEMO: 'demo',
  GOOGLE: 'google',
  LOCAL: 'local'
});

// Use GoogleStrategy to authenticate user
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUser(extractUserProfile(profile, accessToken), done);
    }
  )
);

// Use LocalStrategy to authenticate user
passport.use(
  StrategyType.LOCAL,
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) =>
      findAndAuthenticateUser(email, password)
        .then(user => done(null, user || false))
        .catch(err => done(null, false, { message: err.message }))
  )
);

// Use LocalStrategy for demo purposes
passport.use(
  StrategyType.DEMO,
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      let newUser;

      User.findOne({
        idFromProvider: DEMO_MODE_ID
      })
        .lean()
        .exec()
        .then(user => user || new User({ ...createDemoUser() }).save())
        .then(user => {
          const {
            accessToken,
            avatarUrl,
            displayName,
            email,
            idFromProvider,
            name,
            provider,
            surname
          } = user;

          return new User({
            accessToken,
            avatarUrl,
            displayName,
            email,
            idFromProvider,
            name,
            provider,
            surname
          }).save();
        })
        .then(user => {
          newUser = user;

          return seedDemoData(newUser._id);
        })
        .then(() => done(null, newUser))
        .catch(err => done(null, false, { message: err.message }));
    }
  )
);

passport.serializeUser((user, done) => {
  const { _id } = user;
  done(null, _id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .lean()
    .exec()
    .then(user => done(null, user))
    .catch(err => done(null, false, { message: err.message }));
});

const authenticate = (req, resp, next, type) =>
  passport.authenticate(type, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return resp.sendStatus(401);
    }

    req.login(user, err => {
      if (err) {
        return next(err);
      }

      next();
    });
  })(req, resp, next);

const setUser = (req, resp, next) =>
  authenticate(req, resp, next, StrategyType.LOCAL);

const setDemoUser = (req, resp, next) =>
  authenticate(req, resp, next, StrategyType.DEMO);

const authenticateWithGoogle = passport.authenticate(StrategyType.GOOGLE, {
  scope: ['email', 'profile']
});

const authenticateCallback = passport.authenticate(StrategyType.GOOGLE, {
  failureRedirect: '/',
  successRedirect: '/'
});

const reauthenticate = () => {
  console.log('test');
};

module.exports = {
  authenticateCallback,
  authenticateWithGoogle,
  reauthenticate,
  setDemoUser,
  setUser
};
