/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const promises = [];

  await db
    .collection('lists')
    .find({ created_at: { $exists: true } })
    .forEach(list => {
      // eslint-disable-next-line camelcase
      const { _id, created_at } = list;

      promises.push(async () =>
        db
          .collection('lists')
          .updateOne(
            { _id },
            { $set: { createdAt: created_at }, $unset: { created_at: '' } }
          )
      );
    });

  await runAsyncTasks(...promises);
};

const down = async db => {
  const renameCreatedAtProperty = async () =>
    db
      .collection('lists')
      .updateMany(
        { visibility: { $exists: false } },
        { $set: { visibility: '' } }
      );

  await runAsyncTasks(renameCreatedAtProperty);
};

module.exports = {
  down,
  up
};
