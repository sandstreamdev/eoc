/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const addEmailNotificationSettings = async () =>
    db
      .collection('users')
      .updateMany(
        { emailNotificationSettings: { $exists: false } },
        { $set: { emailNotificationSettings: { weekly: true, never: false } } }
      );

  await runAsyncTasks(addEmailNotificationSettings);
};

const down = async db => {
  const removeEmailNotificationSettings = async () =>
    db
      .collection('users')
      .updateMany(
        { emailNotificationSettings: { $exists: true } },
        { $unset: { emailNotificationSettings: '' } }
      );

  await runAsyncTasks(removeEmailNotificationSettings);
};

module.exports = {
  down,
  up
};
