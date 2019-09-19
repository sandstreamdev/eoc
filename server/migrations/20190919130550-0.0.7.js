/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const promises = [];

  await db
    .collection('lists')
    .find({ items: { $exists: true, $ne: [] } })
    .forEach(list => {
      const { _id, items } = list;
      items.forEach(item => {
        item.done = item.isOrdered;
        delete item.isOrdered;
      });

      promises.push(async () =>
        db.collection('lists').updateOne({ _id }, { $set: { items } })
      );
    });

  await runAsyncTasks(...promises);
};

const down = async db => {
  const promises = [];

  await db
    .collection('lists')
    .find({ items: { $exists: true, $ne: [] } })
    .forEach(list => {
      const { _id, items } = list;
      items.forEach(item => {
        item.isOrdered = item.done;
        delete item.done;
      });

      promises.push(async () =>
        db.collection('lists').updateOne({ _id }, { $set: { items } })
      );
    });

  await runAsyncTasks(...promises);
};

module.exports = {
  down,
  up
};
