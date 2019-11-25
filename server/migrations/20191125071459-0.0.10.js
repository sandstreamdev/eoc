const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const removeNameAndSurname = async () =>
    db
      .collection('users')
      .updateMany(
        { name: { $exists: true }, surname: { $exists: true } },
        { $unset: { name: '', surname: '' } }
      );

  await runAsyncTasks(removeNameAndSurname);
};

const down = async db => {
  const addNameAndSurname = async () =>
    db
      .collection('users')
      .find({ idFromProvider: { $exists: true } })
      .forEach(async user => {
        const { _id, displayName } = user;

        const words = displayName.split(' ');
        const surname = words.pop();
        const name = words.join(' ');

        await db
          .collection('users')
          .updateOne({ _id }, { $set: { name, surname } });
      });

  await runAsyncTasks(addNameAndSurname);
};

module.exports = {
  up,
  down
};
