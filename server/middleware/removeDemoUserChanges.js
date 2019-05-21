const { removeDemoUserData } = require('../common/utils/userUtils');
const { DEMO_MODE_ID } = require('../common/variables');

const removeDemoUserChanges = (req, res, next) => {
  const { user } = req;

  if (!user) {
    return next();
  }

  const { _id: currentUserId, idFromProvider } = req.user;

  if (idFromProvider === DEMO_MODE_ID) {
    return removeDemoUserData(currentUserId)
      .then(() => next())
      .catch(() =>
        res.status(400).send({ message: 'Logout failed. Please try again.' })
      );
  }

  return next();
};

module.exports = { removeDemoUserChanges };
