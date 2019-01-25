const User = require('../models/user.model');
const filter = require('../common/utilities');

// Find or create user
const findOrCreateUser = (user, done) => {
  User.findOne({ idFromProvider: user.idFromProvider }, (err, currentUser) => {
    if (err) {
      done(null, false);
    } else if (currentUser) {
      done(null, currentUser);
    } else {
      new User({ ...user })
        .save()
        .then(newUser => {
          done(null, newUser);
        })
        .catch(() => {
          done(null, false);
        });
    }
  });
};

const extractUserProfile = (profile, accessToken) => {
  const { displayName, emails, id, image, name } = profile._json;
  return {
    accessToken,
    avatar: image.url,
    displayName,
    emails,
    idFromProvider: id,
    name: name.givenName,
    provider: 'google',
    surname: name.familyName
  };
};

// Get user by given id
const getUserById = (req, resp) => {
  User.findById(req.params.id, (err, user) => {
    err ? resp.status(400).send(err.message) : resp.status(200).json(user);
  });
};

// Delete user by given id
const deleteUserById = (req, resp) => {
  User.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
    if (!doc) return resp.status(404).send('No user of given id');
    return err
      ? resp.status(400).send(err.message)
      : resp.status(204).send(`User with _ID: ${req.params.id} deleted!`);
  });
};

// Update user by given id
const updateUser = (req, resp) => {
  const { displayName, name, surname } = req.body;
  const newData = filter(x => x !== undefined)({
    displayName,
    name,
    surname
  });

  User.findOneAndUpdate(
    { _id: req.params.id },
    newData,
    { new: true },
    (err, doc) => {
      if (!doc) return resp.status(404).send('No user of given id');
      return err
        ? resp.status(400).send(err.message)
        : resp.status(200).send(doc);
    }
  );
};

module.exports = {
  deleteUserById,
  extractUserProfile,
  findOrCreateUser,
  getUserById,
  updateUser
};
