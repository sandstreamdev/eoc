const cohortsMock = [
  {
    _id: { $oid: '5ccfe9631ad8a35fee6fbc75' },
    favIds: [],
    isArchived: false,
    memberIds: [{ $oid: '5c9dc5a619ae7924074940f4' }],
    ownerIds: [{ $oid: '5c9dc5a619ae7924074940f4' }],
    description: '',
    name: 'Cohort number 1',
    createdAt: { $date: { $numberLong: '1557129571761' } },
    updatedAt: { $date: { $numberLong: '1557129571761' } },
    __v: { $numberInt: '0' }
  },
  {
    _id: { $oid: '5ccfe96a1ad8a35fee6fbc76' },
    favIds: [],
    isArchived: false,
    memberIds: [{ $oid: '5c9dc5a619ae7924074940f4' }],
    ownerIds: [{ $oid: '5c9dc5a619ae7924074940f4' }],
    description: '',
    name: 'Cohort number 2',
    createdAt: { $date: { $numberLong: '1557129578750' } },
    updatedAt: { $date: { $numberLong: '1557129578750' } },
    __v: { $numberInt: '0' }
  }
];

const expectedCohortMetaDataProperties = [
  '_id',
  'description',
  'isArchived',
  'membersCount',
  'name'
];

const expectedCohortDetailsProperties = [
  '_id',
  'description',
  'isArchived',
  'isMember',
  'isOwner',
  'members',
  'name'
];

module.exports = {
  cohortsMock,
  expectedCohortDetailsProperties,
  expectedCohortMetaDataProperties
};
