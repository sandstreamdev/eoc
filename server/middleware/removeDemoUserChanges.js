const { removeDemoUserData } = require('../common/utils/userUtils');

const removeDemoUserChanges = (req, res, next) => {
  const { user } = req;

  if (!user) {
    return next();
  }

  const { _id: currentUserId, idFromProvider } = req.user;
  const { DEMO_USER_ID_FROM_PROVIDER } = process.env;

  if (idFromProvider === DEMO_USER_ID_FROM_PROVIDER) {
    return removeDemoUserData(currentUserId)
      .then(() => next())
      .catch(() =>
        res.status(400).send({ message: 'Logout failed. Please try again.' })
      );
  }

  return next();
};

module.exports = { removeDemoUserChanges };
