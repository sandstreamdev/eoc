const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../models/user.model');
const { ENDPOINT_URL } = require('../common/variables');

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '535360565912-hvhhi6g8j4ot9l7maikebnkv8v1h8rgb.apps.googleusercontent.com',
      clientSecret: 'fjZ8GsHM5y1fOkPXtXaUUDMy',
      callbackURL: `${ENDPOINT_URL}/auth/google/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      /* TODO check if user exist and than safe in database */
      // console.log(`AccesToken: ${accessToken}, refreshToken: ${refreshToken}`);
      console.log({ profile });
      User.create(
        { googleId: profile.id, displayName: profile.displayName },
        (err, user) => done(err, user)
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

const authenticate = passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login']
});

const authenticateCallback = passport.authenticate('google', {
  failureRedirect: '/login'
});

module.exports = { authenticate, authenticateCallback };
