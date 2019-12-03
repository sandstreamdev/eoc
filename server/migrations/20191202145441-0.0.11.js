/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const addPolicyAccepted = async () =>
    db.collection('users').updateMany(
      {
        policyAccepted: { $exists: false }
      },
      {
        $set: { policyAccepted: true }
      }
    );

  await runAsyncTasks(addPolicyAccepted);
};

const down = async db => {
  const removePolicyAccepted = async () =>
    db.collection('users').updateMany(
      {
        policyAccepted: { $exists: true }
      },
      {
        $unset: { policyAccepted: false }
      }
    );

  await runAsyncTasks(removePolicyAccepted);
};

module.exports = {
  down,
  up
};
