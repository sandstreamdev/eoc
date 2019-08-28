const Cohort = require('../../models/cohort.model');
const List = require('../../models/list.model');

const unlockLocks = () => {
  List.updateMany(
    { locks: { $exists: true } },
    {
      locks: { name: false, description: false }
    }
  ).catch(() => {
    // eslint-disable-next-line no-console
    console.log('Unlocking list locks failed...');
    process.exitCode(1);
  });

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
    .catch(() => {
      // eslint-disable-next-line no-console
      console.log('Unlocking items locks failed...');
      process.exitCode(1);
    });

  Cohort.updateMany(
    { locks: { $exists: true } },
    { locks: { name: false, description: false } }
  ).catch(() => {
    // eslint-disable-next-line no-console
    console.log('Unlocking cohort locks failed...');
    process.exitCode(1);
  });
};

module.exports = unlockLocks;
