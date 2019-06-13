/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const List = require('../models/list.model');
require('dotenv').config();
const { generateLists } = require('./generateLists');

const seedLists = async cohortId => {
  const existingLists = await List.find();

  if (existingLists.length > 0) {
    console.log(`Skip seeding -> collection ${List.modelName} not empty`);

    return;
  }

  console.log('Seeding lists... 🌱 🌱');
  const lists = generateLists(cohortId);

  // eslint-disable-next-line no-unused-vars
  let counter = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const list of lists) {
    const newList = new List(list);

    await newList.save();
    counter += 1;
  }
};

module.exports = {
  seedLists
};
