const bcrypt = require('bcryptjs');
const sanitize = require('mongo-sanitize');

const User = require('../../models/user.model');
const List = require('../../models/list.model');
const Cohort = require('../../models/cohort.model');
const Comment = require('../../models/comment.model');

// Find or create user
const findOrCreateUser = (user, done) => {
  const { idFromProvider, email } = user;

  User.findOne({
    $or: [{ idFromProvider }, { email }]
  })
    .exec()
    .then(doc => {
      if (doc) {
        const { email, idFromProvider: existingIdFromProvider, isActive } = doc;

        if (email && !existingIdFromProvider) {
          const { accessToken, avatarUrl, name, provider, surname } = user;

          /* eslint-disable no-param-reassign */
          doc.accessToken = accessToken;
          doc.avatarUrl = avatarUrl;
          doc.idFromProvider = idFromProvider;
          doc.name = name;
          doc.provider = provider;
          doc.surname = surname;

          if (!isActive) {
            doc.activatedAt = new Date();
            doc.isActive = true;
            doc.signUpHash = null;
            doc.signUpHashExpirationDate = null;
          }
          /* eslint-enable no-param-reassign */

          return doc.save();
        }

        return doc;
      }

      return new User({ ...user, activatedAt: new Date() }).save();
    })
    .then(user => done(null, user))
    .catch(err => done(null, false, { message: err.message }));
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

const validatePassword = value => value.match(/^[^\s]{4,32}$/);

module.exports = {
  extractUserProfile,
  findAndAuthenticateUser,
  findOrCreateUser,
  removeDemoUserData,
  validatePassword
};
