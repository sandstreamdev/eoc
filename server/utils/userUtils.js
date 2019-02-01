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

const extractUserProfile = (profile, accessToken) => {
  const { displayName, emails, id, image, name } = profile._json;
  return {
    accessToken,
    avatarUrl: image.url,
    displayName,
    email: emails[0].value,
    idFromProvider: id,
    name: name.givenName,
    provider: 'google',
    surname: name.familyName
  };
};

module.exports = {
  extractUserProfile,
  findOrCreateUser
};
