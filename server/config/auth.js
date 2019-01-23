const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const { ENDPOINT_URL } = require('../common/variables');
const {
  userFindOrCreate,
  extractUserProfile
} = require('../controllers/userAuth');

// Use GoogleStrategy to authenicate user
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${ENDPOINT_URL}/auth/google/callback`,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
      userFindOrCreate(extractUserProfile(profile, accessToken), done);
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
  scope: ['https://www.googleapis.com/auth/plus.login', 'email', 'profile']
});

const authenticateCallback = passport.authenticate('google', {
  failureRedirect: '/'
});

module.exports = { authenticate, authenticateCallback };
