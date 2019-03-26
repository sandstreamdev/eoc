/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

const Cohort = require('../models/cohort.model');
require('dotenv').config();

const userId = process.env.USER_ID;
const initialCohorts = [
  {
    _id: '5c9a12eb46e555ba24992a2c',
    adminIds: [userId],
    isArchived: false,
    memberIds: [],
    name: 'Cohorta 1',
    description: ''
  },
  {
    _id: '5c9a12f046e555ba24992a2d',
    adminIds: [userId],
    isArchived: false,
    memberIds: [],
    name: 'Cohort 2',
    description: ''
  }
];

const seedCohorts = async () => {
  const existingCohorts = await Cohort.find();

  if (existingCohorts.length > 0) {
    console.log(`Skip seeding -> collection ${Cohort.modelName} not empty`);
    return;
  }

  console.log('Seeding lists... 🌱 🌱');
  let counter = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const cohort of initialCohorts) {
    const newCohort = new Cohort({ ...cohort });

    await newCohort.save();
    counter += 1;
  }
};

module.exports = {
  seedCohorts
};
