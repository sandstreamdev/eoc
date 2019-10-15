/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');
const { EmailReportsFrequency } = require('../common/variables.js');

const up = async db => {
  const addEmailNotificationSettings = async () =>
    db.collection('users').updateMany(
      {
        emailReportsFrequency: { $exists: false },
        lastEmailReportSentAt: { $exists: false }
      },
      {
        $set: {
          emailReportsFrequency: EmailReportsFrequency.NEVER,
          lastEmailReportSentAt: ''
        }
      }
    );

  await runAsyncTasks(addEmailNotificationSettings);
};

const down = async db => {
  const removeEmailNotificationSettings = async () =>
    db.collection('users').updateMany(
      {
        emailReportsFrequency: { $exists: true },
        lastEmailReportSentAt: { $exists: true }
      },
      {
        $unset: {
          emailReportsFrequency: '',
          lastEmailReportSentAt: ''
        }
      }
    );

  await runAsyncTasks(removeEmailNotificationSettings);
};

module.exports = {
  down,
  up
};
