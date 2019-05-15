const User = require('../../models/user.model');
const List = require('../../models/list.model');
const Cohort = require('../../models/cohort.model');
const Comment = require('../../models/comment.model');
const { seedDemoData } = require('../../seed/demoSeed/seedDemoData');

// Find or create user
const findOrCreateUser = (user, doneCallback) => {
  User.findOne({ idFromProvider: user.idFromProvider }, (err, currentUser) => {
    if (
      err ||
      (!currentUser &&
        user.idFromProvider === process.env.DEMO_USER_ID_FROM_PROVIDER)
    ) {
      return doneCallback(null, false);
    }

    if (!currentUser) {
      return new User({ ...user })
        .save()
        .then(newUser => doneCallback(null, newUser))
        .catch(err => doneCallback(null, false, { message: err.message }));
    }

    if (currentUser.idFromProvider === process.env.DEMO_USER_ID_FROM_PROVIDER) {
      return new User({ ...user })
        .save()
        .then(async newUser => {
          await seedDemoData(newUser._id);
          return doneCallback(null, newUser);
        })
        .catch(err => {
          doneCallback(null, false, { message: err.message });
        });
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
