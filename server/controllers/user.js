const User = require('../models/user.model');
const filter = require('../common/utils/utilities');

// Get user by given id
const getUserById = (req, resp) => {
  User.findById(req.params.id, (err, user) => {
    err ? resp.status(404).send(err.message) : resp.status(200).json(user);
  });
};

// Delete user by given id
const deleteUserById = (req, resp) => {
  User.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
    if (!doc) return resp.status(404).send('No user of given id');
    return err
      ? resp.status(400).send(err.message)
      : resp.status(204).send(`User with _ID: ${req.params.id} deleted!`);
  });
};

// Update user by given id
const updateUser = (req, resp) => {
  const { displayName, name, surname } = req.body;
  const newData = filter(x => x !== undefined)({
    displayName,
    name,
    surname
  });

  User.findOneAndUpdate(
    { _id: req.params.id },
    newData,
    { new: true },
    (err, doc) => {
      if (!doc) return resp.status(404).send('No user of given id');
      return err
        ? resp.status(400).send(err.message)
        : resp.status(200).send(doc);
    }
  );
};

module.exports = {
  deleteUserById,
  getUserById,
  updateUser
};
