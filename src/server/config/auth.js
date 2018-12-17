const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const { ENDPOINT_URL } = require('../common/variables');

// Use GoogleStrategy to authenicate user
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '535360565912-hvhhi6g8j4ot9l7maikebnkv8v1h8rgb.apps.googleusercontent.com',
      clientSecret: 'fjZ8GsHM5y1fOkPXtXaUUDMy',
      callbackURL: `${ENDPOINT_URL}/auth/google/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
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
  scope: ['https://www.googleapis.com/auth/plus.login']
});

const authenticateCallback = passport.authenticate('google', {
  failureRedirect: '/'
});

module.exports = { authenticate, authenticateCallback };
