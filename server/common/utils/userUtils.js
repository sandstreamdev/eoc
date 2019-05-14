const User = require('../../models/user.model');
const { seedDemoData } = require('../../seed/demoSeed/seedDemoData');

// Find or create user
const findOrCreateUser = (user, doneCallback) => {
  User.findOne({ idFromProvider: user.idFromProvider }, (err, currentUser) => {
    if (err) return doneCallback(null, false);

    if (!currentUser) {
      return new User({ ...user })
        .save()
        .then(newUser => doneCallback(null, newUser))
        .catch(err => doneCallback(null, false, { message: err.message }));
    }

    if (currentUser.idFromProvider === process.env.DEMO_USER_ID_FROM_PROVIDER) {
      return new User({ ...user })
        .save()
        .then(newUser => {
          seedDemoData(newUser._id).catch(err => {
            throw err;
          });
          return doneCallback(null, newUser);
        })
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
