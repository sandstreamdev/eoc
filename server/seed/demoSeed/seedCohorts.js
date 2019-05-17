const Cohort = require('../../models/cohort.model');
const { generateCohorts } = require('./generateCohorts');

const seedCohorts = async (demoUserId, userIds) => {
  const cohorts = generateCohorts(demoUserId, userIds);

  const pendingCohorts = cohorts.map(cohort => new Cohort(cohort).save());

  return Promise.all(pendingCohorts).then(() => cohorts);
};

module.exports = { seedCohorts };
