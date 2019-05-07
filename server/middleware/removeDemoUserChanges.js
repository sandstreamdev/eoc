const List = require('../models/list.model');
const Cohort = require('../models/cohort.model');

const removeDemoUserChanges = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { _id: currentUserId } = req.user;

  if (currentUserId === process.env.DEMO_USER_ID) {
    try {
      await List.deleteMany({ ownerIds: process.env.DEMO_USER_ID }).exec();
      await Cohort.deleteMany({ ownerIds: process.env.DEMO_USER_ID }).exec();
    } catch {
      return res
        .status(400)
        .send({ message: 'Logout failed. Please try again.' });
    }
  }

  return next();
};

module.exports = { removeDemoUserChanges };
