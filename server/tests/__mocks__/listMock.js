const listMock = [
  {
    _id: { $oid: '5ccd610f4663533f995b1755' },
    cohortId: null,
    favIds: [],
    isArchived: false,
    type: 'limited',
    memberIds: ['5c9dc5a619ae7924074940f4'],
    ownerIds: ['5c9dc5a619ae7924074940f4'],
    viewersIds: ['5c9dc5a619ae7924074940f4'],
    description: '',
    name: 'Test list',
    items: [
      {
        _id: { $oid: '5ccd61134663533f995b1756' },
        authorName: 'Adam Klepacz',
        authorId: '5c9dc5a619ae7924074940f4',
        createdAt: { $date: { $numberLong: '1556963603400' } },
        description: '',
        done: false,
        isArchived: false,
        name: 'Milk',
        updatedAt: { $date: { $numberLong: '1556963603400' } },
        voterIds: []
      },
      {
        _id: { $oid: '5ccd61174663533f995b1758' },
        authorName: 'Adam Klepacz',
        authorId: '5c9dc5a619ae7924074940f4',
        createdAt: { $date: { $numberLong: '1556963607250' } },
        description: '',
        done: false,
        isArchived: false,
        name: 'Coffee',
        updatedAt: { $date: { $numberLong: '1556963607250' } },
        voterIds: []
      },
      {
        _id: { $oid: '5ccd611a4663533f995b175a' },
        authorName: 'Adam Klepacz',
        authorId: '5c9dc5a619ae7924074940f4',
        createdAt: { $date: { $numberLong: '1556963610226' } },
        description: '',
        done: false,
        isArchived: false,
        name: 'Bread',
        updatedAt: { $date: { $numberLong: '1556963610226' } },
        voterIds: []
      },
      {
        _id: { $oid: '5ccd611e4663533f995b175c' },
        authorName: 'Adam Klepacz',
        authorId: '5c9dc5a619ae7924074940f4',
        createdAt: { $date: { $numberLong: '1556963614753' } },
        description: '',
        done: false,
        isArchived: false,
        name: 'A4 Sheets',
        updatedAt: { $date: { $numberLong: '1556963614753' } },
        voterIds: []
      }
    ],
    created_at: { $date: { $numberLong: '1556963599739' } },
    updatedAt: { $date: { $numberLong: '1556963614753' } },
    __v: { $numberInt: '0' }
  }
];

const listDetailsMock = {
  _id: { $oid: '5ccd610f4663533f995b1755' },
  cohortId: null,
  favIds: [],
  isArchived: false,
  type: 'limited',
  memberIds: ['5c9dc5a619ae7924074940f4', '5c9dc5a619ae7924074989er'],
  ownerIds: ['5c9dc5a619ae7924074940f4'],
  viewersIds: [
    {
      _id: '5c9dc5a619ae7924074940f4',
      avatarUrl: 'https://test.pl/photo.jpeg',
      displayName: 'John Doe'
    },
    {
      _id: '5c9dc5a619ae7924074989er',
      avatarUrl: 'https://test.pl/photo.jpeg',
      displayName: 'William Doe'
    }
  ],
  description: '',
  name: 'Test list',
  items: [
    {
      _id: { $oid: '5ccd61134663533f995b1756' },
      authorName: 'Adam Klepacz',
      authorId: {
        _id: '5c9dc5a619ae7924074940f4',
        avatarUrl: 'https://test.pl/photo.jpeg',
        displayName: 'John Doe'
      },
      editedBy: {
        _id: '5c9dc5a619ae7924074940f4',
        avatarUrl: 'https://test.pl/photo.jpeg',
        displayName: 'John Doe'
      },
      createdAt: { $date: { $numberLong: '1556963603400' } },
      description: '',
      done: false,
      isArchived: false,
      name: 'Milk',
      updatedAt: { $date: { $numberLong: '1556963603400' } },
      voterIds: []
    },
    {
      _id: { $oid: '5ccd61174663533f995b1758' },
      authorName: 'Adam Klepacz',
      authorId: {
        _id: '5c9dc5a619ae7924074940f4',
        avatarUrl: 'https://test.pl/photo.jpeg',
        displayName: 'John Doe'
      },
      editedBy: {
        _id: '5c9dc5a619ae7924074940f4',
        avatarUrl: 'https://test.pl/photo.jpeg',
        displayName: 'John Doe'
      },
      createdAt: { $date: { $numberLong: '1556963607250' } },
      description: '',
      done: false,
      isArchived: false,
      name: 'Coffee',
      updatedAt: { $date: { $numberLong: '1556963607250' } },
      voterIds: []
    }
  ],
  created_at: { $date: { $numberLong: '1556963599739' } },
  updatedAt: { $date: { $numberLong: '1556963614753' } },
  __v: { $numberInt: '0' }
};

const expectedListProperties = [
  '_id',
  'createdAt',
  'description',
  'doneItemsCount',
  'isFavourite',
  'name',
  'type',
  'unhandledItemsCount'
];

const expectedCohortListProperties = [
  '_id',
  'cohortId',
  'description',
  'doneItemsCount',
  'isFavourite',
  'name',
  'type',
  'unhandledItemsCount'
];

const expectedListMetaDataProperties = [
  '_id',
  'cohortId',
  'createdAt',
  'description',
  'doneItemsCount',
  'isFavourite',
  'name',
  'type',
  'unhandledItemsCount'
];

const expectedListDetailsProperties = [
  '_id',
  'cohortId',
  'cohortName',
  'createdAt',
  'description',
  'doneItemsCount',
  'isArchived',
  'isFavourite',
  'isGuest',
  'isMember',
  'isOwner',
  'items',
  'members',
  'name',
  'type',
  'unhandledItemsCount'
];

module.exports = {
  expectedCohortListProperties,
  expectedListDetailsProperties,
  expectedListMetaDataProperties,
  expectedListProperties,
  listDetailsMock,
  listMock
};
