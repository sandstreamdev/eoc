const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const _isEmpty = require('lodash/isEmpty');

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

const Routes = Object.freeze({
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up'
});

const {
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} = process.env;

// Use GoogleStrategy to authenticate user
passport.use(
  new GoogleStrategy(
    {
      callbackURL: GOOGLE_CALLBACK_URL,
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      passReqToCallback: true,
      proxy: true,
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    (request, accessToken, refreshToken, profile, done) => {
      const { policyAcceptedAt } = JSON.parse(request.query.state);

      findOrCreateUser(
        extractUserProfile(profile, accessToken),
        done,
        policyAcceptedAt
      );
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
            provider
          } = user;

          return new User({
            accessToken,
            avatarUrl,
            displayName,
            email,
            idFromProvider,
            provider
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

const authenticate = (req, resp, next, type) => {
  if (type === StrategyType.DEMO && _isEmpty(req.body)) {
    req.body = {
      email: 'demo@example.com',
      password: 'demo'
    };
  }

  return passport.authenticate(type, (err, user) => {
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
};

const setUser = (req, resp, next) =>
  authenticate(req, resp, next, StrategyType.LOCAL);

const setDemoUser = (req, resp, next) =>
  authenticate(req, resp, next, StrategyType.DEMO);

const signInWithGoogle = passport.authenticate(StrategyType.GOOGLE, {
  scope: ['email', 'profile'],
  state: JSON.stringify({
    sourceRoute: Routes.SIGN_IN
  })
});

const signUpWithGoogle = (req, resp, next) => {
  const { data } = req.params;
  const { policyAcceptedAt } = JSON.parse(data);

  return passport.authenticate(StrategyType.GOOGLE, {
    scope: ['email', 'profile'],
    state: JSON.stringify({
      policyAcceptedAt,
      sourceRoute: Routes.SIGN_UP
    })
  })(req, resp, next);
};

const authenticateCallback = (req, resp, next) => {
  const { sourceRoute } = JSON.parse(req.query.state);

  return passport.authenticate(StrategyType.GOOGLE, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return resp.redirect(`${sourceRoute}/error`);
    }

    req.login(user, error => {
      if (error) {
        return next(error);
      }

      return resp.redirect('/');
    });
  })(req, resp, next);
};

const checkPolicyAgreement = (req, resp, next) => {
  const { data } = req.params;
  const params = JSON.parse(data);

  if (!params || !params.policyAcceptedAt) {
    return resp.redirect(`${Routes.SIGN_UP}/agreement-required`);
  }

  return next();
};

module.exports = {
  authenticateCallback,
  checkPolicyAgreement,
  setDemoUser,
  setUser,
  signInWithGoogle,
  signUpWithGoogle
};
