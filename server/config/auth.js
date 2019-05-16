const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;

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
    User.findOne({
      idFromProvider: process.env.DEMO_USER_ID_FROM_PROVIDER
    })
      .lean()
      .exec()
      .then(user => {
        const { _id, ...rest } = user;
        return new User({ ...rest }).save();
      })
      .then(async newUser => {
        await seedDemoData(newUser._id);
        return done(null, newUser);
      })
      .catch(err => done(null, false, { message: err.message }));
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
      .lean()
      .exec();
    done(null, user);
  } catch (err) {
    done(null, false, { message: err.message });
  }
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
