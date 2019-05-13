const itemsMock = [
  {
    description: '',
    isOrdered: false,
    link: '',
    voterIds: [],
    _id: { $oid: '5ccd61134663533f995b1756' },
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'John Doe'
    },
    name: 'Milk',
    updatedAt: { $date: { $numberLong: '1556963603400' } },
    createdAt: { $date: { $numberLong: '1556963603400' } }
  },
  {
    description: '',
    isOrdered: false,
    link: '',
    voterIds: [],
    _id: { $oid: '5ccd61174663533f995b1758' },
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'William Doe'
    },
    name: 'Coffee',
    updatedAt: { $date: { $numberLong: '1556963607250' } },
    createdAt: { $date: { $numberLong: '1556963607250' } }
  },
  {
    description: '',
    isOrdered: false,
    link: '',
    voterIds: [],
    _id: { $oid: '5ccd611a4663533f995b175a' },
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'Brad Doe'
    },
    name: 'Bread',
    updatedAt: { $date: { $numberLong: '1556963610226' } },
    createdAt: { $date: { $numberLong: '1556963610226' } }
  },
  {
    description: '',
    isOrdered: false,
    link: '',
    voterIds: [],
    _id: { $oid: '5ccd611e4663533f995b175c' },
    authorId: '5c9dc5a619ae7924074940f4',
    name: 'A4 Sheets',
    updatedAt: { $date: { $numberLong: '1556963614753' } },
    createdAt: { $date: { $numberLong: '1556963614753' } }
  }
];

const expectedItemProperties = [
  '_id',
  'authorId',
  'authorName',
  'createdAt',
  'description',
  'isOrdered',
  'link',
  'name',
  'updatedAt'
];

module.exports = { expectedItemProperties, itemsMock };
