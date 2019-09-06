/* eslint-disable no-console */
const mongoose = require('mongoose');

const { DB_URL } = require('../common/variables');
const { seedLists } = require('./seedLists');
const { seedCohorts } = require('./seedCohorts');

const dbUrl = DB_URL;

const connectDatabase = () =>
  mongoose
    .connect(dbUrl, { useNewUrlParser: true })
    .then(() => console.info('Connected to db... ✅'))
    .catch(() => process.exit(1));

const disconnectDatabase = () =>
  mongoose
    .disconnect()
    .then(() => console.log('Succesfully disconected... 🏁'))
    .catch(() => process.exit(1));

const seedDatabase = async () => {
  await connectDatabase();

  try {
    const data = await seedCohorts();
    const { _id: cohortId } = data[0];
    await seedLists(cohortId);
    console.log('\n🍺  All seeds done!\n');
  } finally {
    await disconnectDatabase();
  }
};

seedDatabase().catch(error => {
  console.error('☠️  Something went terribly wrong:', error);
  process.exit(1);
});
