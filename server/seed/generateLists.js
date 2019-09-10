const userId = process.env.USER_ID;
const mongoose = require('mongoose');

const { ListType } = require('../common/variables');
const generateItems = require('./generateItems');

const {
  Types: { ObjectId }
} = mongoose;

const generateLists = cohortId => [
  {
    _id: ObjectId(),
    cohortId: null,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    favIds: [userId],
    isArchived: false,
    isDeleted: false,
    items: generateItems(userId)(3),
    locks: {
      description: false,
      name: false
    },
    memberIds: [userId],
    name: 'Private sack 1',
    ownerIds: [userId],
    type: ListType.LIMITED,
    viewersIds: [userId]
  },
  {
    _id: ObjectId(),
    cohortId: null,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    favIds: [userId],
    isArchived: false,
    isDeleted: false,
    items: [],
    locks: {
      description: false,
      name: false
    },
    memberIds: [userId],
    name: 'Private sack 2',
    ownerIds: [userId],
    type: ListType.LIMITED,
    viewersIds: [userId]
  },
  {
    _id: ObjectId(),
    cohortId: null,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    favIds: [userId],
    isArchived: true,
    isDeleted: false,
    items: [],
    locks: {
      description: false,
      name: false
    },
    memberIds: [userId],
    name: 'Private sack 3',
    ownerIds: [userId],
    type: ListType.LIMITED,
    viewersIds: [userId]
  },
  {
    _id: ObjectId(),
    cohortId,
    description: '',
    favIds: [],
    isArchived: false,
    isDeleted: false,
    items: [],
    locks: {
      description: false,
      name: false
    },
    memberIds: [userId],
    name: 'Sack 1 in cohort 2',
    ownerIds: [userId],
    type: ListType.SHARED,
    viewersIds: [userId]
  },
  {
    _id: ObjectId(),
    cohortId,
    description: '',
    favIds: [],
    isArchived: false,
    isDeleted: false,
    items: [],
    locks: {
      description: false,
      name: false
    },
    memberIds: [userId],
    name: 'Sack 2 in cohort 2',
    ownerIds: [userId],
    type: ListType.SHARED,
    viewersIds: [userId]
  },
  {
    _id: ObjectId(),
    cohortId,
    description: '',
    favIds: [],
    isArchived: true,
    isDeleted: false,
    items: [],
    locks: {
      description: false,
      name: false
    },
    memberIds: [userId],
    name: 'Archived sack 3 in cohort 2',
    ownerIds: [userId],
    type: ListType.SHARED,
    viewersIds: [userId]
  }
];

module.exports = {
  generateLists
};
