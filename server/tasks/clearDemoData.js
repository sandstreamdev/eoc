/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const mongoose = require('mongoose');

require('dotenv').config();
const { DB_URL } = require('../common/variables');
const { removeDemoUserData } = require('../common/utils/userUtils');
const User = require('../models/user.model');

const dbUrl = DB_URL;

const connectDatabase = () =>
  mongoose
    .connect(
      dbUrl,
      { useNewUrlParser: true }
    )
    .then(() => console.info('Connected to db...'))
    .catch(() => process.exit(1));

const disconnectDatabase = () =>
  mongoose
    .disconnect()
    .then(() => console.log('Successfully disconnected...'))
    .catch(() => process.exit(1));

const clearDemoData = async () => {
  await connectDatabase();

  const idFromProvider = process.env.DEMO_USER_ID_FROM_PROVIDER;
  const mainDemoUserId = process.env.DEMO_USER_ID;

  try {
    const demoUsers = await User.find(
      { idFromProvider, _id: { $ne: mainDemoUserId } },
      '_id'
    )
      .lean()
      .exec();

    if (demoUsers.length === 0) {
      console.log('\nThere is no demo data!\n');
      return;
    }

    const demoUserIds = demoUsers.map(user => user._id);

    // eslint-disable-next-line no-unused-vars
    let counter = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const id of demoUserIds) {
      await removeDemoUserData(id);
      counter += 1;
    }

    console.log('\nAll demo data removed!\n');
  } finally {
    await disconnectDatabase();
  }
};

clearDemoData().catch(error => {
  console.log('Something went terribly wrong:', error);
  process.exit(1);
});
