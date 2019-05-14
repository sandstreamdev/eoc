const List = require('../models/list.model');
const Cohort = require('../models/cohort.model');
const User = require('../models/user.model');

const removeDemoUserChanges = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { _id: currentUserId, idFromProvider } = req.user;

  if (idFromProvider === process.env.DEMO_USER_ID_FROM_PROVIDER) {
    try {
      await List.deleteMany({ ownerIds: currentUserId }).exec();
      await Cohort.deleteMany({ ownerIds: currentUserId }).exec();
      await User.deleteOne({ _id: currentUserId });
    } catch {
      return res
        .status(400)
        .send({ message: 'Logout failed. Please try again.' });
    }
  }

  return next();
};

module.exports = { removeDemoUserChanges };
