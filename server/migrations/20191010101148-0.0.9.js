/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const addEmailNotificationSettings = async () =>
    db.collection('users').updateMany(
      {
        emailNotificationsFrequency: { $exists: false },
        emailReportSentAt: { $exists: false }
      },
      {
        $set: {
          emailNotificationsFrequency: '',
          emailReportSentAt: ''
        }
      }
    );

  await runAsyncTasks(addEmailNotificationSettings);
};

const down = async db => {
  const removeEmailNotificationSettings = async () =>
    db.collection('users').updateMany(
      {
        emailNotificationsFrequency: { $exists: true },
        emailReportSentAt: { $exists: true }
      },
      { $unset: { emailNotificationsFrequency: '', emailReportSentAt: '' } }
    );

  await runAsyncTasks(removeEmailNotificationSettings);
};

module.exports = {
  down,
  up
};
