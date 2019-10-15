const itemsMock = [
  {
    _id: { $oid: '5ccd61134663533f995b1756' },
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
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
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'William Doe'
    },
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
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'Brad Doe'
    },
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
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'Brad Doe'
    },
    createdAt: { $date: { $numberLong: '1556963614753' } },
    description: '',
    done: false,
    isArchived: false,
    name: 'A4 Sheets',
    updatedAt: { $date: { $numberLong: '1556963614753' } },
    voterIds: []
  }
];

const expectedItemProperties = [
  '_id',
  'authorId',
  'authorName',
  'createdAt',
  'description',
  'done',
  'isArchived',
  'name',
  'updatedAt'
];

module.exports = { expectedItemProperties, itemsMock };
