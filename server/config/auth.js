const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;

const { createDemoUser } = require('../seed/demoSeed/generateUsers');
const { seedDemoData } = require('../seed/demoSeed/seedDemoData');
const {
  extractUserProfile,
  findOrCreateUser
} = require('../common/utils/userUtils');
const User = require('../models/user.model');
const { DEMO_MODE_ID } = require('../common/variables');
const signIn = require('../controllers/userAuth');

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
  'normal-mode',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      signIn(email, password)
        .then(user => done(null, user))
        .catch(err => done(null, false, { message: err.message }));
    }
  )
);

// Use LocalStrategy for demo purposes
passport.use(
  'demo-mode',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      let newUser;

      User.findOne({
        idFromProvider: DEMO_MODE_ID
      })
        .lean()
        .exec()
        .then(user => {
          if (!user) {
            return new User({ ...createDemoUser() }).save();
          }

          return user;
        })
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

const authenticateUser = passport.authenticate('normal-mode', {
  failureRedirect: '/'
});

const setDemoUser = passport.authenticate('demo-mode', {
  failureRedirect: '/'
});

const authenticateWithGoogle = passport.authenticate('google', {
  scope: ['email', 'profile']
});

const authenticateCallback = passport.authenticate('google', {
  failureRedirect: '/'
});

module.exports = {
  authenticateCallback,
  authenticateUser,
  authenticateWithGoogle,
  setDemoUser
};
