const mongoose = require('mongoose');

const User = require('../../models/user.model');
const { DB_URL } = require('../../common/variables');

// Find or create user
const findOrCreateUser = (user, doneCallback) => {
  User.findOne(
    { idFromProvider: user.idFromProvider },
    async (err, currentUser) => {
      if (err) return doneCallback(null, false);
      if (!currentUser) {
        return new User({ ...user })
          .save()
          .then(newUser => doneCallback(null, newUser))
          .catch(err => doneCallback(null, false, { message: err.message }));
      }

      if (
        currentUser.idFromProvider.toString() ===
        process.env.DEMO_USER_ID_FROM_PROVIDER
      ) {
        try {
          await mongoose.connection.close();

          const demoUser = new User({ ...user });

          await mongoose.connect(`${DB_URL}/eoc-${demoUser._id}`);
          await mongoose.set('useCreateIndex', true);

          return demoUser
            .save()
            .then(newUser => doneCallback(null, newUser))
            .catch(err =>
              doneCallback(null, false, {
                message: err.message
              })
            );
        } catch {
          return doneCallback(null, false);
        }
      }

      return doneCallback(null, currentUser);
    }
  );
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
