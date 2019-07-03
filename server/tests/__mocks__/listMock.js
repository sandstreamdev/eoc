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
        description: '',
        isOrdered: false,
        voterIds: [],
        _id: { $oid: '5ccd61134663533f995b1756' },
        authorName: 'Adam Klepacz',
        authorId: '5c9dc5a619ae7924074940f4',
        isArchived: false,
        name: 'Milk',
        updatedAt: { $date: { $numberLong: '1556963603400' } },
        createdAt: { $date: { $numberLong: '1556963603400' } }
      },
      {
        description: '',
        isOrdered: false,
        voterIds: [],
        _id: { $oid: '5ccd61174663533f995b1758' },
        authorName: 'Adam Klepacz',
        authorId: '5c9dc5a619ae7924074940f4',
        isArchived: false,
        name: 'Coffee',
        updatedAt: { $date: { $numberLong: '1556963607250' } },
        createdAt: { $date: { $numberLong: '1556963607250' } }
      },
      {
        description: '',
        isOrdered: false,
        voterIds: [],
        _id: { $oid: '5ccd611a4663533f995b175a' },
        authorName: 'Adam Klepacz',
        authorId: '5c9dc5a619ae7924074940f4',
        isArchived: false,
        name: 'Bread',
        updatedAt: { $date: { $numberLong: '1556963610226' } },
        createdAt: { $date: { $numberLong: '1556963610226' } }
      },
      {
        description: '',
        isOrdered: false,
        voterIds: [],
        _id: { $oid: '5ccd611e4663533f995b175c' },
        authorName: 'Adam Klepacz',
        authorId: '5c9dc5a619ae7924074940f4',
        isArchived: false,
        name: 'A4 Sheets',
        updatedAt: { $date: { $numberLong: '1556963614753' } },
        createdAt: { $date: { $numberLong: '1556963614753' } }
      }
    ],
    created_at: { $date: { $numberLong: '1556963599739' } },
    updatedAt: { $date: { $numberLong: '1556963614753' } },
    __v: { $numberInt: '0' }
  }
];

const expectedListProperties = [
  '_id',
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
  'description',
  'doneItemsCount',
  'isFavourite',
  'name',
  'type',
  'unhandledItemsCount'
];

module.exports = {
  expectedCohortListProperties,
  expectedListMetaDataProperties,
  expectedListProperties,
  listMock
};
