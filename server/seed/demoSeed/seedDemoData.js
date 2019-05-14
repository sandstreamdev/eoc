/* eslint-disable no-console */

const { seedUsers } = require('./seedUsers');
const { seedCohorts } = require('./seedCohorts');
const { seedLists } = require('./seedLists');
const { seedComments } = require('./seedComments');

const seedDemoData = async demoUserId => {
  try {
    const users = await seedUsers(demoUserId);

    const userIds = users.map(user => user._id);

    const cohorts = await seedCohorts(demoUserId, userIds);

    const cohortIds = cohorts.map(cohort => cohort._id);

    const lists = await seedLists(demoUserId, userIds, cohortIds);

    const listData = lists.map(list => {
      const { _id: id, items, memberIds } = list;
      return {
        id,
        itemIds: items.map(item => item._id),
        memberIds
      };
    });

    await seedComments(listData);
  } catch (err) {
    throw err;
  }
};

module.exports = { seedDemoData };
