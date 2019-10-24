/* eslint-disable no-param-reassign */
const { runAsyncTasks } = require('../common/utils');

const up = async db => {
  const addDeleteTokenData = async () =>
    db.collection('users').updateMany(
      {
        deleteToken: { $exists: false },
        deleteTokenExpirationDate: { $exists: false }
      },
      {
        $set: {
          deleteToken: '',
          deleteTokenExpirationDate: ''
        }
      }
    );

  await runAsyncTasks(addDeleteTokenData);
};

const down = async db => {
  const removeDeleteTokenData = async () =>
    db.collection('users').updateMany(
      {
        deleteToken: { $exists: true },
        deleteTokenExpirationDate: { $exists: true }
      },
      {
        $unset: {
          deleteToken: '',
          deleteTokenExpirationDate: ''
        }
      }
    );

  await runAsyncTasks(removeDeleteTokenData);
};

module.exports = {
  down,
  up
};
