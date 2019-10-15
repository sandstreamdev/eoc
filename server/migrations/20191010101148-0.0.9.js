/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');
const { EmailReportsFrequency } = require('../common/variables.js');

const up = async db => {
  const addEmailReportsSettings = async () =>
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

  await runAsyncTasks(addEmailReportsSettings);
};

const down = async db => {
  const removeEmailReportsSettings = async () =>
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

  await runAsyncTasks(removeEmailReportsSettings);
};

module.exports = {
  down,
  up
};
