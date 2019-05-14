const List = require('../models/list.model');
const Cohort = require('../models/cohort.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');

const removeDemoUserChanges = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { _id: currentUserId, idFromProvider } = req.user;

  if (idFromProvider === process.env.DEMO_USER_ID_FROM_PROVIDER) {
    try {
      const lists = await List.find(
        {
          $or: [
            { ownerIds: currentUserId },
            { memberIds: currentUserId },
            { viewersIds: currentUserId }
          ]
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
        $or: [
          { ownerIds: currentUserId },
          { memberIds: currentUserId },
          { viewersIds: currentUserId }
        ]
      }).exec();
      await Cohort.deleteMany({
        $or: [{ ownerIds: currentUserId }, { memberIds: currentUserId }]
      }).exec();
      await User.deleteOne({ _id: currentUserId });
      await User.deleteMany({ provider: `demo-${currentUserId}` });
    } catch {
      return res
        .status(400)
        .send({ message: 'Logout failed. Please try again.' });
    }
  }

  return next();
};

module.exports = { removeDemoUserChanges };
