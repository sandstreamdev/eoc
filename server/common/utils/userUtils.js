const User = require('../../models/user.model');
const List = require('../../models/list.model');
const Cohort = require('../../models/cohort.model');
const Comment = require('../../models/comment.model');

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

const removeDemoUserData = id =>
  List.find(
    {
      $or: [{ ownerIds: id }, { memberIds: id }, { viewersIds: id }]
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
    .then(() =>
      List.deleteMany({
        $or: [{ ownerIds: id }, { memberIds: id }, { viewersIds: id }]
      }).exec()
    )
    .then(() =>
      Cohort.deleteMany({
        $or: [{ ownerIds: id }, { memberIds: id }]
      }).exec()
    )
    .then(() => User.deleteOne({ _id: id }).exec())
    .then(() => User.deleteMany({ provider: `demo-${id}` }).exec());

module.exports = {
  extractUserProfile,
  findOrCreateUser,
  removeDemoUserData
};
