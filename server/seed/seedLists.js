/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const List = require('../models/list.model');
require('dotenv').config();

const userId = process.env.USER_ID;
const initialLists = [
  {
    adminIds: [userId],
    cohortId: null,
    isArchived: false,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    name: 'Private list 1',
    items: [
      {
        isOrdered: true,
        voterIds: [],
        _id: '5c9a123b074ce3b9ff43ce30',
        authorName: 'Adam',
        authorId: userId,
        name: 'item 1'
      },
      {
        isOrdered: false,
        voterIds: [],
        _id: '5c9a123e074ce3b9ff43ce32',
        authorName: 'Adam',
        authorId: userId,
        name: 'item 2'
      },
      {
        isOrdered: false,
        voterIds: [userId],
        _id: '5c9a1240074ce3b9ff43ce34',
        authorName: 'Adam',
        authorId: userId,
        name: 'item 3'
      }
    ]
  },
  {
    _id: '5c9a1299341674ba31ff6aa7',
    adminIds: [userId],
    cohortId: null,
    isArchived: false,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    name: 'Private list 2',
    items: []
  },
  {
    _id: '5c9a1299341674ba31ff6aa8',
    adminIds: [userId],
    cohortId: null,
    isArchived: true,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    name: 'Private list 3',
    items: []
  },
  {
    _id: '5c9a130146e555ba24992a2e',
    adminIds: [userId],
    cohortId: '5c9a12f046e555ba24992a2d',
    isArchived: false,
    description: '',
    name: 'List 1 in cohort 2',
    items: []
  },
  {
    _id: '5c9a130746e555ba24992a2f',
    adminIds: [userId],
    cohortId: '5c9a12f046e555ba24992a2d',
    isArchived: false,
    description: '',
    name: 'List 2 in cohort 2',
    items: []
  },
  {
    _id: '5c9a131346e555ba24992a30',
    adminIds: [userId],
    cohortId: '5c9a12f046e555ba24992a2d',
    isArchived: true,
    description: '',
    name: 'Archived list 3 in cohort 2',
    items: []
  }
];

const seedLists = async () => {
  const existingLists = await List.find();

  if (existingLists.length > 0) {
    console.log(`Skip seeding -> collection ${List.modelName} not empty`);
    return;
  }

  console.log('Seeding lists... 🌱 🌱');
  let counter = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const list of initialLists) {
    const newList = new List({
      ...list
    });

    await newList.save();
    counter += 1;
  }
};

module.exports = {
  seedLists
};
