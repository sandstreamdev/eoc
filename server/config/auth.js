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

// Use LocalStrategy for demo purposes
passport.use(
  new LocalStrategy((username, password, done) => {
    let newUser;

    const { DEMO_USER_ID_FROM_PROVIDER } = process.env;

    User.findOne({
      idFromProvider: DEMO_USER_ID_FROM_PROVIDER
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
  })
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

const setDemoUser = passport.authenticate('local', {
  failureRedirect: '/'
});

const authenticate = passport.authenticate('google', {
  scope: ['email', 'profile']
});

const authenticateCallback = passport.authenticate('google', {
  failureRedirect: '/'
});

module.exports = {
  authenticate,
  authenticateCallback,
  setDemoUser
};
