const mongoose = require('mongoose');

const removeDemoUserChanges = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { idFromProvider } = req.user;

  if (idFromProvider === process.env.DEMO_USER_ID_FROM_PROVIDER) {
    try {
      await mongoose.connection.db.dropDatabase();
    } catch {
      return res
        .status(400)
        .send({ message: 'Logout failed. Please try again.' });
    }
  }

  return next();
};

module.exports = { removeDemoUserChanges };
