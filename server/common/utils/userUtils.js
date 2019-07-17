const bcrypt = require('bcryptjs');
const sanitize = require('mongo-sanitize');

const User = require('../../models/user.model');
const List = require('../../models/list.model');
const Cohort = require('../../models/cohort.model');
const Comment = require('../../models/comment.model');

// Find or create user
const findOrCreateUser = (user, done) =>
  User.findOne({
    $or: [{ idFromProvider: user.idFromProvider }, { email: user.email }]
  })
    .exec()
    .then(doc => {
      if (doc) {
        const { idFromProvider, email, isActive, activatedAt } = doc;

        if (email && !idFromProvider) {
          const {
            accessToken,
            avatarUrl,
            idFromProvider,
            name,
            provider,
            surname
          } = user;

          /* eslint-disable no-param-reassign */
          doc.accessToken = accessToken;
          doc.avatarUrl = avatarUrl;
          doc.idFromProvider = idFromProvider;
          doc.name = name;
          doc.provider = provider;
          doc.surname = surname;
          if (!activatedAt) {
            doc.activatedAt = new Date();
          }
          if (!isActive) {
            doc.isActive = true;
          }
          /* eslint-enable no-param-reassign */

          return doc.save();
        }

        return doc;
      }

      return new User({ ...user }).save();
    })
    .then(user => done(null, user))
    .catch(err => done(null, false, { message: err.message }));

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
