/* eslint-disable no-await-in-loop */
const Cohort = require('../../models/cohort.model');
const { generateCohorts } = require('./generateCohorts');

const seedCohorts = async (demoUserId, userIds) => {
  const cohorts = generateCohorts(demoUserId, userIds);

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

module.exports = { seedCohorts };
