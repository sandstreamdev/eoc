const { runAsyncTasks } = require('../common/utils');

const locks = { description: false, name: false };

const up = async db => {
  const addLocksToCohorts = async () =>
    db
      .collection('cohorts')
      .updateMany({ locks: { $exists: false } }, { $set: { locks } });

  const addLocksToCLists = async () =>
    db
      .collection('lists')
      .updateMany({ locks: { $exists: false } }, { $set: { locks } });

  const addLocksToItems = async () =>
    db
      .collection('lists')
      .updateMany(
        { items: { $exists: true, $ne: [] } },
        { $set: { 'items.$[].locks': locks } }
      );

  runAsyncTasks(addLocksToCohorts, addLocksToCLists, addLocksToItems);
};

const down = async db => {
  const removeLocksFromCohorts = async () =>
    db
      .collection('cohorts')
      .updateMany({ locks: { $exists: true } }, { $unset: { locks } });

  const removeLocksFromLists = async () =>
    db
      .collection('lists')
      .updateMany({ locks: { $exists: true } }, { $unset: { locks } });

  const removeLocksFromItems = async () =>
    db
      .collection('lists')
      .updateMany(
        { items: { $exists: true, $ne: [] } },
        { $unset: { 'items.$[].locks': {} } }
      );

  runAsyncTasks(
    removeLocksFromCohorts,
    removeLocksFromLists,
    removeLocksFromItems
  );
};

module.exports = {
  up,
  down
};
