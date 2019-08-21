/* eslint-disable no-console */
const up = db =>
  db
    .collection('cohorts')
    .updateMany(
      { isDeleted: { $exists: false } },
      { $set: { isDeleted: false } }
    )
    .then(() =>
      db
        .collection('lists')
        .updateMany(
          { isDeleted: { $exists: false } },
          { $set: { isDeleted: false } }
        )
    )
    .then(() =>
      db
        .collection('lists')
        .updateMany(
          { items: { $exists: true, $ne: [] } },
          { $set: { 'items.$[].isDeleted': false } }
        )
    )
    .catch(() => {
      console.log('up migration failed...');
    });

const down = db =>
  db
    .collection('cohorts')
    .updateMany(
      { isDeleted: { $exists: true } },
      { $unset: { isDeleted: false } }
    )
    .then(() =>
      db
        .collection('lists')
        .updateMany(
          { isDeleted: { $exists: true } },
          { $unset: { isDeleted: false } }
        )
    )
    .then(() =>
      db
        .collection('lists')
        .updateMany(
          { items: { $exists: true, $ne: [] } },
          { $unset: { 'items.$[].isDeleted': false } }
        )
    )
    .catch(() => {
      console.log('down migration failed...');
    });

module.exports = {
  up,
  down
};
