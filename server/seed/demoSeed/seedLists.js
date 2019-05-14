/* eslint-disable no-await-in-loop */
const List = require('../../models/list.model');
// require('dotenv').config();
const { generateLists } = require('./generateLists');

const seedLists = async (demoUserId, userIds, cohortIds) => {
  const lists = generateLists(demoUserId, userIds, cohortIds);

  // eslint-disable-next-line no-unused-vars
  let counter = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const list of lists) {
    const newList = new List(list);

    await newList.save();
    counter += 1;
  }

  return lists;
};

module.exports = { seedLists };
