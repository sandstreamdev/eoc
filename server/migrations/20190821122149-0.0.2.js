/* eslint-disable no-console */
const locks = { description: false, name: false };

const up = db =>
  db
    .collection('cohorts')
    .updateMany({ locks: { $exists: false } }, { $set: { locks } })
    .then(() =>
      db
        .collection('lists')
        .updateMany({ locks: { $exists: false } }, { $set: { locks } })
    )
    .then(() =>
      db
        .collection('lists')
        .updateMany(
          { items: { $exists: true, $ne: [] } },
          { $set: { 'items.$[].locks': locks } }
        )
    )
    .catch(() => console.log('up migration failed...'));

const down = db =>
  db
    .collection('cohorts')
    .updateMany({ locks: { $exists: true } }, { $unset: { locks } })
    .then(() =>
      db
        .collection('lists')
        .updateMany({ locks: { $exists: true } }, { $unset: { locks } })
    )
    .then(() =>
      db
        .collection('lists')
        .updateMany(
          { items: { $exists: true, $ne: [] } },
          { $unset: { 'items.$[].locks': {} } }
        )
    )
    .catch(() => console.log('down migration failed...'));

module.exports = {
  up,
  down
};
