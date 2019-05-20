const { seedUsers } = require('./seedUsers');
const { seedCohorts } = require('./seedCohorts');
const { seedLists } = require('./seedLists');
const { seedComments } = require('./seedComments');

const seedDemoData = demoUserId => {
  let cohortIds;
  let userIds;

  seedUsers(demoUserId)
    .then(users => {
      userIds = users.map(user => user._id);

      return seedCohorts(demoUserId, userIds);
    })
    .then(cohorts => {
      cohortIds = cohorts.map(cohort => cohort._id);

      return seedLists(demoUserId, userIds, cohortIds);
    })
    .then(lists => {
      const listData = lists.map(list => {
        const { _id: id, items, memberIds } = list;

        return {
          id,
          itemIds: items.map(item => item._id),
          memberIds
        };
      });

      return seedComments(listData);
    });
};

module.exports = { seedDemoData };
