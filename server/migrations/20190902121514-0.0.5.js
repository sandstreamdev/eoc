const { runAsyncTasks } = require('../common/utils');
const Settings = require('../models/settings.model');

const up = async db => {
  const removeSettingsFromUser = async () =>
    db
      .collection('users')
      .updateMany(
        { settings: { $exists: true } },
        { $unset: { settings: {} } }
      );

  await runAsyncTasks(removeSettingsFromUser);
};

const down = async db => {
  const addSettingsToUser = async () =>
    db
      .collection('users')
      .updateMany(
        { settings: { $exists: false } },
        { $set: { settings: new Settings() } }
      );

  await runAsyncTasks(addSettingsToUser);
};

module.exports = {
  down,
  up
};
