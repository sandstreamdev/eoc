const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const { ENDPOINT_URL, FRONTEND_URL } = require('../common/variables');
const {
  extractUserProfile,
  findOrCreateUser
} = require('../common/utils/userUtils');

// Use GoogleStrategy to authenticate user
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${ENDPOINT_URL}/auth/google/callback`,
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUser(extractUserProfile(profile, accessToken), done);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const authenticate = passport.authenticate('google', {
  scope: ['email', 'profile']
});

const authenticateCallback = passport.authenticate('google', {
  failureRedirect: FRONTEND_URL
});

module.exports = { authenticate, authenticateCallback };
