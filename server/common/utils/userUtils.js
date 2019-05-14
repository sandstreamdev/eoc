const User = require('../../models/user.model');

// Find or create user
const findOrCreateUser = (user, doneCallback) => {
  User.findOne({ idFromProvider: user.idFromProvider }, (err, currentUser) => {
    if (err) return doneCallback(null, false);

    const createNewUser =
      !currentUser ||
      currentUser.idFromProvider === process.env.DEMO_USER_ID_FROM_PROVIDER;

    if (createNewUser) {
      return new User({ ...user })
        .save()
        .then(newUser => doneCallback(null, newUser))
        .catch(err => doneCallback(null, false, { message: err.message }));
    }

    return doneCallback(null, currentUser);
  });
};

/* eslint camelcase: "off" */
const extractUserProfile = (profile, accessToken) => {
  const { email, family_name, given_name, name, picture } = profile._json;
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
