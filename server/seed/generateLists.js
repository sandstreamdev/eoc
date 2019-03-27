const userId = process.env.USER_ID;

const generateLists = cohortId => [
  {
    adminIds: [userId],
    cohortId: null,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    isArchived: false,
    items: [
      {
        _id: '5c9a123b074ce3b9ff43ce30',
        authorId: userId,
        authorName: 'Adam',
        isOrdered: true,
        name: 'item 1',
        voterIds: []
      },
      {
        _id: '5c9a123e074ce3b9ff43ce32',
        authorId: userId,
        authorName: 'Adam',
        isOrdered: false,
        name: 'item 2',
        voterIds: []
      },
      {
        _id: '5c9a1240074ce3b9ff43ce34',
        authorId: userId,
        authorName: 'Adam',
        isOrdered: false,
        name: 'item 3',
        voterIds: [userId]
      }
    ],
    name: 'Private list 1'
  },
  {
    _id: '5c9a1299341674ba31ff6aa7',
    adminIds: [userId],
    cohortId: null,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    isArchived: false,
    items: [],
    name: 'Private list 2'
  },
  {
    _id: '5c9a1299341674ba31ff6aa8',
    adminIds: [userId],
    cohortId: null,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    isArchived: true,
    items: [],
    name: 'Private list 3'
  },
  {
    _id: '5c9a130146e555ba24992a2e',
    adminIds: [userId],
    cohortId: '5c9a12f046e555ba24992a2d',
    description: '',
    isArchived: false,
    items: [],
    name: 'List 1 in cohort 2'
  },
  {
    _id: '5c9a130746e555ba24992a2f',
    adminIds: [userId],
    cohortId,
    description: '',
    isArchived: false,
    items: [],
    name: 'List 2 in cohort 2'
  },
  {
    _id: '5c9a131346e555ba24992a30',
    adminIds: [userId],
    cohortId,
    description: '',
    isArchived: true,
    items: [],
    name: 'Archived list 3 in cohort 2'
  }
];

module.exports = {
  generateLists
};
