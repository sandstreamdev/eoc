/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');

const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const changeEditedByToObjectId = async () =>
    db
      .collection('lists')
      .find({ items: { $exists: true, $ne: [] } })
      .forEach(async list => {
        const { _id, items } = list;

        items.forEach(async item => {
          const { editedBy } = item;

          if (typeof editedBy === 'string') {
            item.editedBy = ObjectId(editedBy);
          }
        });

        await db.collection('lists').updateOne({ _id }, { $set: { items } });
      });

  await runAsyncTasks(changeEditedByToObjectId);
};

const down = async db => {
  const changeEditedByToString = async () =>
    db
      .collection('lists')
      .find({ items: { $exists: true, $ne: [] } })
      .forEach(async list => {
        const { _id, items } = list;

        items.forEach(async item => {
          const { editedBy } = item;
          item.editedBy = editedBy.toString();
        });

        await db.collection('lists').updateOne({ _id }, { $set: { items } });
      });

  await runAsyncTasks(changeEditedByToString);
};

module.exports = {
  up,
  down
};
