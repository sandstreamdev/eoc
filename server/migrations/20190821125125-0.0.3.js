const { runAsyncTasks } = require('../common/utils');
const Settings = require('../models/settings.model');

const up = async db => {
  const addSettingsToUser = async () =>
    db
      .collection('users')
      .updateMany(
        { settings: { $exists: false } },
        { $set: { settings: new Settings() } }
      );

  runAsyncTasks(addSettingsToUser);
};

const down = async db => {
  const removeSettingsFromUser = async () =>
    db
      .collection('users')
      .updateMany(
        { settings: { $exists: true } },
        { $unset: { settings: {} } }
      );

  runAsyncTasks(removeSettingsFromUser);
};

module.exports = {
  up,
  down
};
