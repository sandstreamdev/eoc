/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const renameCreatedAt = async () =>
    db
      .collection('lists')
      .updateMany(
        { created_at: { $exists: true } },
        { $rename: { created_at: 'createdAt' } }
      );

  await runAsyncTasks(renameCreatedAt);
};

const down = async db => {
  const renameCreatedAt = async () =>
    db
      .collection('lists')
      .updateMany(
        { createdAt: { $exists: true } },
        { $rename: { createdAt: 'created_at' } }
      );

  await runAsyncTasks(renameCreatedAt);
};

module.exports = {
  down,
  up
};
