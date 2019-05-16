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

const removeDemoUserData = async id => {
  try {
    const lists = await List.find(
      {
        $or: [{ ownerIds: id }, { memberIds: id }, { viewersIds: id }]
      },
      '_id'
    )
      .lean()
      .exec();

    if (lists) {
      const listsIds = lists.map(lists => lists._id);
      await Comment.deleteMany({ listId: { $in: listsIds } });
    }

    await List.deleteMany({
      $or: [{ ownerIds: id }, { memberIds: id }, { viewersIds: id }]
    }).exec();

    await Cohort.deleteMany({
      $or: [{ ownerIds: id }, { memberIds: id }]
    }).exec();

    await User.deleteOne({ _id: id }).exec();

    await User.deleteMany({ provider: `demo-${id}` }).exec();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  extractUserProfile,
  findOrCreateUser,
  removeDemoUserData
};
