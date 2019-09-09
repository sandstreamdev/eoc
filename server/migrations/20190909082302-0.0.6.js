const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const removeVisibilityFromLists = async () =>
    db
      .collection('lists')
      .updateMany(
        { visibility: { $exists: true } },
        { $unset: { visibility: '' } }
      );

  await runAsyncTasks(removeVisibilityFromLists);
};

const down = async db => {
  const addVisibilityToLists = async () =>
    db
      .collection('lists')
      .updateMany(
        { visibility: { $exists: false } },
        { $set: { visibility: '' } }
      );

  await runAsyncTasks(addVisibilityToLists);
};

module.exports = {
  down,
  up
};
