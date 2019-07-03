const bcrypt = require('bcryptjs');
const sanitize = require('mongo-sanitize');

const User = require('../../models/user.model');
const List = require('../../models/list.model');
const Cohort = require('../../models/cohort.model');
const Comment = require('../../models/comment.model');

// Find or create user
const findOrCreateUser = (user, doneCallback) => {
  User.findOne({ idFromProvider: user.idFromProvider }, (err, currentUser) => {
    if (err) {
      return doneCallback(null, false);
    }

    if (currentUser) {
      return doneCallback(null, currentUser);
    }

    return new User({ ...user })
      .save()
      .then(newUser => doneCallback(null, newUser))
      .catch(err => doneCallback(null, false, { message: err.message }));
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

const findAndAuthenticateUser = (email, password) => {
  const sanitizedEmail = sanitize(email);

  return User.findOne({ email: sanitizedEmail, isActive: true })
    .lean()
    .exec()
    .then(user => {
      if (user) {
        const { password: dbPassword } = user;

        if (bcrypt.compareSync(password + email, dbPassword)) {
          return user;
        }
      }

      return null;
    });
};

const removeDemoUserData = id =>
  List.find(
    {
      viewersIds: id
    },
    '_id'
  )
    .lean()
    .exec()
    .then(lists => {
      if (lists) {
        const listsIds = lists.map(lists => lists._id);

        return Comment.deleteMany({ listId: { $in: listsIds } }).exec();
      }
    })
    .then(() => List.deleteMany({ viewersIds: id }).exec())
    .then(() => Cohort.deleteMany({ memberIds: id }).exec())
    .then(() => User.deleteOne({ _id: id }).exec())
    .then(() => User.deleteMany({ provider: `demo-${id}` }).exec());

module.exports = {
  extractUserProfile,
  findAndAuthenticateUser,
  findOrCreateUser,
  removeDemoUserData
};
