const usersMock = [
  {
    _id: { $oid: '5c9dc5a619ae7924074940f4' },
    avatarUrl: 'https://test.pl/photo.jpeg',
    displayName: 'John Doe',
    email: 'test@test.pl',
    name: 'John',
    surname: 'Doe',
    createdAt: { $date: { $numberLong: '1553843622677' } },
    updatedAt: { $date: { $numberLong: '1553843622677' } },
    __v: { $numberInt: '0' }
  },
  {
    _id: { $oid: '5c9dc5a619ae7924074940f4' },
    avatarUrl: 'https://test.pl/photo.jpeg',
    displayName: 'William Doe',
    email: 'william@test.pl',
    name: 'John',
    surname: 'Doe',
    createdAt: { $date: { $numberLong: '1553843622677' } },
    updatedAt: { $date: { $numberLong: '1553843622677' } },
    __v: { $numberInt: '0' }
  },
  {
    _id: { $oid: '5c9dc5a619ae7924074940f4' },
    avatarUrl: 'https://test.pl/photo.jpeg',
    displayName: 'Brad Doe',
    email: 'brad@test.pl',
    name: 'Brad',
    surname: 'Doe',
    createdAt: { $date: { $numberLong: '1553843622677' } },
    updatedAt: { $date: { $numberLong: '1553843622677' } },
    __v: { $numberInt: '0' }
  },
  {
    _id: { $oid: '5c9dc5a619ae7924074940f4' },
    avatarUrl: 'https://test.pl/photo.jpeg',
    displayName: 'Angelina Doe',
    email: 'Angelina@test.pl',
    name: 'Angelina',
    surname: 'Doe',
    createdAt: { $date: { $numberLong: '1553843622677' } },
    updatedAt: { $date: { $numberLong: '1553843622677' } },
    __v: { $numberInt: '0' }
  }
];

const expectedUsersProperties = [
  '_id',
  'avatarUrl',
  'displayName',
  'isMember',
  'isOwner'
];

module.exports = { expectedUsersProperties, usersMock };
