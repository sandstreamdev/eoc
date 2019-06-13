/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const Cohort = require('../models/cohort.model');
require('dotenv').config();
const { generateCohorts } = require('./generateCohorts');

const seedCohorts = async () => {
  const existingCohorts = await Cohort.find();

  if (existingCohorts.length > 0) {
    console.log(`Skip seeding -> collection ${Cohort.modelName} not empty`);

    return;
  }

  const cohorts = generateCohorts(2);

  console.log('Seeding cohorts... 🌱 🌱');
  // eslint-disable-next-line no-unused-vars
  let counter = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const cohort of cohorts) {
    const newCohort = new Cohort(cohort);

    await newCohort.save();
    counter += 1;
  }

  return cohorts;
};

module.exports = {
  seedCohorts
};
