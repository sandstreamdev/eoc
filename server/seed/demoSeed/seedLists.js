const List = require('../../models/list.model');
const { generateLists } = require('./generateLists');

const seedLists = (demoUserId, userIds, cohortIds) => {
  const lists = generateLists(demoUserId, userIds, cohortIds);
  const pendingLists = lists.map(list => new List(list).save());

  return Promise.all(pendingLists).then(() => lists);
};

module.exports = { seedLists };
