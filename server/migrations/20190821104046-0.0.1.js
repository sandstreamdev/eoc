const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const addIsDeleteToCohorts = async () =>
    db
      .collection('cohorts')
      .updateMany(
        { isDeleted: { $exists: false } },
        { $set: { isDeleted: false } }
      );

  const addIsDeleteToLists = async () =>
    db
      .collection('lists')
      .updateMany(
        { isDeleted: { $exists: false } },
        { $set: { isDeleted: false } }
      );

  const addIsDeleteToItems = async () =>
    db
      .collection('lists')
      .updateMany(
        { items: { $exists: true, $ne: [] } },
        { $set: { 'items.$[].isDeleted': false } }
      );

  runAsyncTasks(addIsDeleteToCohorts, addIsDeleteToLists, addIsDeleteToItems);
};

const down = async db => {
  const removeIsDeletedFromCohorts = async () =>
    db
      .collection('cohorts')
      .updateMany(
        { isDeleted: { $exists: true } },
        { $unset: { isDeleted: false } }
      );

  const removeIsDeleteFromLists = async () =>
    db
      .collection('lists')
      .updateMany(
        { isDeleted: { $exists: true } },
        { $unset: { isDeleted: false } }
      );

  const removeIsDeletedFromItems = async () =>
    db
      .collection('lists')
      .updateMany(
        { items: { $exists: true, $ne: [] } },
        { $unset: { 'items.$[].isDeleted': false } }
      );

  runAsyncTasks(
    removeIsDeletedFromCohorts,
    removeIsDeleteFromLists,
    removeIsDeletedFromItems
  );
};

module.exports = {
  up,
  down
};
