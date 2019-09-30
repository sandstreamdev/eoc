const cohortsMock = [
  {
    _id: { $oid: '5ccfe9631ad8a35fee6fbc75' },
    isArchived: false,
    memberIds: ['5c9dc5a619ae7924074940f4'],
    ownerIds: ['5c9dc5a619ae7924074940f4'],
    description: '',
    name: 'Cohort number 1',
    createdAt: { $date: { $numberLong: '1557129571761' } },
    updatedAt: { $date: { $numberLong: '1557129571761' } },
    __v: { $numberInt: '0' }
  },
  {
    _id: { $oid: '5ccfe96a1ad8a35fee6fbc76' },
    isArchived: false,
    memberIds: ['5c9dc5a619ae7924074940f4'],
    ownerIds: ['5c9dc5a619ae7924074940f4'],
    description: '',
    name: 'Cohort number 2',
    createdAt: { $date: { $numberLong: '1557129578750' } },
    updatedAt: { $date: { $numberLong: '1557129578750' } },
    __v: { $numberInt: '0' }
  }
];

const cohortDetailsMock = {
  _id: { $oid: '5ccfe96a1ad8a35fee6fbc77' },
  isArchived: false,
  memberIds: [
    {
      _id: { $oid: '5c9dc5a619ae7924074940f4' },
      avatarUrl: 'https://test.pl/photo.jpeg',
      displayName: 'John Doe'
    },
    {
      _id: { $oid: '5c9dc5a619ae7924074940f7' },
      avatarUrl: 'https://test.pl/photo.jpeg',
      displayName: 'William Doe'
    },
    {
      _id: { $oid: '5c9dc5a619ae7924074940f3' },
      avatarUrl: 'https://test.pl/photo.jpeg',
      displayName: 'Brad Doe'
    }
  ],
  ownerIds: ['5c9dc5a619ae7924074940f4'],
  description: '',
  name: 'Cohort number 2',
  createdAt: { $date: { $numberLong: '1557129578750' } },
  updatedAt: { $date: { $numberLong: '1557129578750' } },
  __v: { $numberInt: '0' }
};

const expectedCohortMetaDataProperties = [
  '_id',
  'createdAt',
  'description',
  'isArchived',
  'isMember',
  'isOwner',
  'membersCount',
  'name'
];

const expectedCohortDetailsProperties = [
  '_id',
  'createdAt',
  'description',
  'isArchived',
  'isMember',
  'isOwner',
  'members',
  'name'
];

module.exports = {
  cohortDetailsMock,
  cohortsMock,
  expectedCohortDetailsProperties,
  expectedCohortMetaDataProperties
};
