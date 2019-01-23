const { FRONTEND_URL } = require('../common/variables');
const User = require('../models/user.model');

const userFindOrCreate = (user, cb) => {
  User.findOne({ idFromProvider: user.idFromProvider }, (err, currentUser) => {
    if (currentUser) {
      cb(null, currentUser);
    } else {
      new User({ ...user }).save().then(
        newUser => {
          cb(null, newUser);
        },
        saveErr => {
          throw new Error(saveErr);
        }
      );
    }
  });
};

const extractUserProfile = (profile, accessToken) => {
  const { displayName, name, image, emails, id } = profile._json;
  return {
    displayName,
    name: name.givenName,
    surname: name.familyName,
    avatar: image.url,
    email: emails[0].value,
    provider: 'google',
    idFromProvider: id,
    accessToken
  };
};

const setUserAndSession = (req, res) => {
  // Set user cookies
  res.cookie(
    'user',
    JSON.stringify({
      name: req.user.displayName,
      id: req.user.idFromProvider,
      avatar: req.user.avatar,
      token: 'token'
    })
  );

  res.redirect(FRONTEND_URL);
};

const logout = (req, res) => {
  req.session.destroy(() => {
    req.logout();

    res.clearCookie('connect.sid');
    res.clearCookie('user');
    res.redirect(FRONTEND_URL);
  });
};

module.exports = {
  extractUserProfile,
  logout,
  setUserAndSession,
  userFindOrCreate
};
