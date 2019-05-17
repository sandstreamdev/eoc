/* eslint-disable no-console */
const mongoose = require('mongoose');

require('dotenv').config();
const { DB_URL } = require('../common/variables');
const { removeDemoUserData } = require('../common/utils/userUtils');
const User = require('../models/user.model');

const dbUrl = DB_URL;

const connectDatabase = () =>
  mongoose
    .connect(dbUrl, { useNewUrlParser: true })
    .then(() => console.info('Connected to db...'))
    .catch(() => process.exit(1));

const disconnectDatabase = () =>
  mongoose
    .disconnect()
    .then(() => console.log('Successfully disconnected...'))
    .catch(() => process.exit(1));

const clearDemoData = () => {
  const idFromProvider = process.env.DEMO_USER_ID_FROM_PROVIDER;
  const mainDemoUserId = process.env.DEMO_USER_ID;

  connectDatabase()
    .then(() =>
      User.find({ idFromProvider, _id: { $ne: mainDemoUserId } }, '_id')
        .lean()
        .exec()
    )
    .then(demoUsers => {
      if (!demoUsers || demoUsers.length === 0) {
        console.log('\nThere is no demo data!\n');
        return;
      }

      const demoUserIds = demoUsers.map(user => user._id);
      const pendingDeletions = demoUserIds.map(id => removeDemoUserData(id));

      return Promise.all(pendingDeletions);
    })
    .then(res => {
      if (res) {
        console.log('\nAll demo data removed!\n');
      }
    })
    .catch(err => {
      console.log('Something went terribly wrong:', err);
      process.exit(1);
    })
    .finally(() => disconnectDatabase());
};

clearDemoData();
