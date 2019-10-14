/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');
const { EmailNotificationFrequency } = require('../common/variables.js');

const up = async db => {
  const addEmailNotificationSettings = async () =>
    db.collection('users').updateMany(
      {
        emailNotificationsFrequency: { $exists: false },
        lastEmailNotificationSentAt: { $exists: false }
      },
      {
        $set: {
          emailNotificationsFrequency: EmailNotificationFrequency.NEVER,
          lastEmailNotificationSentAt: ''
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
        lastEmailNotificationSentAt: { $exists: true }
      },
      {
        $unset: {
          emailNotificationsFrequency: '',
          lastEmailNotificationSentAt: ''
        }
      }
    );

  await runAsyncTasks(removeEmailNotificationSettings);
};

module.exports = {
  down,
  up
};
