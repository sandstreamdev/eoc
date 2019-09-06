const userId = process.env.USER_ID;
const { ListType } = require('../common/variables');

const generateLists = cohortId => [
  {
    _id: '5c9a1299341674ba31ff6aas',
    cohortId: null,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    favIds: [userId],
    isArchived: false,
    isDeleted: false,
    items: [
      {
        _id: '5c9a123b074ce3b9ff43ce30',
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
        _id: '5c9a123e074ce3b9ff43ce32',
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
        _id: '5c9a1240074ce3b9ff43ce34',
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
    _id: '5c9a1299341674ba31ff6aa7',
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
    _id: '5c9a1299341674ba31ff6aa8',
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
    _id: '5c9a130146e555ba24992a2e',
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
    _id: '5c9a130746e555ba24992a2f',
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
    _id: '5c9a131346e555ba24992a30',
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
