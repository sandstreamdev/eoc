/* eslint-disable no-console */
const Settings = require('../models/settings.model');

const up = db =>
  db
    .collection('users')
    .updateMany(
      { settings: { $exists: false } },
      { $set: { settings: new Settings() } }
    )
    .catch(() => console.log('up migration failed...'));

const down = db =>
  db
    .collection('users')
    .updateMany({ settings: { $exists: true } }, { $unset: { settings: {} } })
    .catch(() => console.log('down migration failed...'));

module.exports = {
  up,
  down
};
