const Cohort = require('../models/cohort.model');
const List = require('../models/list.model');

const unlockLocks = () =>
  List.updateMany(
    { locks: { $exists: true } },
    {
      locks: { name: false, description: false }
    }
  )
    .then(() =>
      List.find({ items: { $exists: true } })
        .exec()
        .then(lists => {
          lists.forEach(list => {
            const { items } = list;

            items.forEach(item => {
              const { locks } = item;

              locks.name = false;
              locks.description = false;
            });

            list.save();
          });
        })
        .catch(err => {
          throw err;
        })
    )
    .then(() =>
      Cohort.updateMany(
        { locks: { $exists: true } },
        { locks: { name: false, description: false } }
      ).catch(err => {
        throw err;
      })
    )
    // eslint-disable-next-line no-console
    .catch(() => console.error('Unlocking items failed...'));

module.exports = unlockLocks;
