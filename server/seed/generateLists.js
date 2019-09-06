const userId = process.env.USER_ID;
const mongoose = require('mongoose');

const { ListType } = require('../common/variables');

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
    items: [
      {
        _id: ObjectId(),
        authorId: userId,
        authorName: 'Adam',
        description: '',
        isArchived: false,
        isDeleted: false,
        isOrdered: true,
        locks: {
          description: false,
          name: false
        },
        name: 'item 1',
        purchaserId: '',
        voterIds: []
      },
      {
        _id: ObjectId(),
        authorId: userId,
        authorName: 'Adam',
        description: '',
        isArchived: false,
        isDeleted: false,
        isOrdered: false,
        locks: {
          description: false,
          name: false
        },
        name: 'item 2',
        purchaserId: '',
        voterIds: []
      },
      {
        _id: ObjectId(),
        authorId: userId,
        authorName: 'Adam',
        description: '',
        isArchived: false,
        isDeleted: false,
        isOrdered: false,
        locks: {
          description: false,
          name: false
        },
        name: 'item 3',
        purchaserId: '',
        voterIds: [userId]
      }
    ],
    locks: {
      description: false,
      name: false
    },
    memberIds: [],
    name: 'Private sack 1',
    ownerIds: [userId],
    type: ListType.LIMITED,
    viewersIds: []
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
    memberIds: [],
    name: 'Private sack 2',
    ownerIds: [userId],
    type: ListType.LIMITED,
    viewersIds: []
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
    memberIds: [],
    name: 'Private sack 3',
    ownerIds: [userId],
    type: ListType.LIMITED,
    viewersIds: []
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
    memberIds: [],
    name: 'Sack 1 in cohort 2',
    ownerIds: [userId],
    type: ListType.SHARED,
    viewersIds: []
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
    memberIds: [],
    name: 'Sack 2 in cohort 2',
    ownerIds: [userId],
    type: ListType.SHARED,
    viewersIds: []
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
    memberIds: [],
    name: 'Archived sack 3 in cohort 2',
    ownerIds: [userId],
    type: ListType.SHARED,
    viewersIds: []
  }
];

module.exports = {
  generateLists
};
