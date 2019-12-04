const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const promises = [];

  await db
    .collection('users')
    .find({
      policyAcceptedAt: { $exists: false }
    })
    .forEach(user => {
      const { _id, createdAt } = user;
      const policyAcceptedAt = createdAt;

      promises.push(async () =>
        db
          .collection('users')
          .updateOne({ _id }, { $set: { policyAcceptedAt } })
      );
    });

  await runAsyncTasks(...promises);
};

const down = async db => {
  const removePolicyAcceptedAt = async () =>
    db.collection('users').updateMany(
      {
        policyAcceptedAt: { $exists: true }
      },
      {
        $unset: { policyAcceptedAt: '' }
      }
    );

  await runAsyncTasks(removePolicyAcceptedAt);
};

module.exports = {
  down,
  up
};
