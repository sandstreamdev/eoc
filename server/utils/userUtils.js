const User = require('../models/user.model');

// Find or create user
const findOrCreateUser = (user, doneCallback) => {
  User.findOne({ idFromProvider: user.idFromProvider }, (err, currentUser) => {
    if (err) return doneCallback(null, false);
    if (currentUser) return doneCallback(null, currentUser);
    return new User({ ...user })
      .save()
      .then(newUser => doneCallback(null, newUser))
      .catch(err => doneCallback(null, false, { message: err.message }));
  });
};

/* eslint camelcase: "off" */
const extractUserProfile = (profile, accessToken) => {
  const { email, picture, name, given_name, family_name } = profile._json;
  const { id } = profile;

  return {
    accessToken,
    avatarUrl: picture,
    displayName: name,
    email,
    idFromProvider: id,
    name: given_name,
    provider: 'google',
    surname: family_name
  };
};

module.exports = {
  extractUserProfile,
  findOrCreateUser
};
