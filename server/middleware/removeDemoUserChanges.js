const { removeDemoUserData } = require('../common/utils/userUtils');

const removeDemoUserChanges = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { _id: currentUserId, idFromProvider } = req.user;

  if (idFromProvider === process.env.DEMO_USER_ID_FROM_PROVIDER) {
    return removeDemoUserData(currentUserId)
      .then(() => next())
      .catch(() =>
        res.status(400).send({ message: 'Logout failed. Please try again.' })
      );
  }

  return next();
};

module.exports = { removeDemoUserChanges };
