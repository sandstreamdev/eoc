const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

const generateCohorts = (demoUserId, userIds) => [
  {
    _id: ObjectId(),
    description:
      'You are the owner of this cohort. You can create sacks, add members and manage their permissions, modify and archive cohort.',
    isArchived: false,
    isDeleted: false,
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId, ...userIds],
    name: 'Cohort example - owner',
    ownerIds: [demoUserId]
  },
  {
    _id: ObjectId(),
    description:
      'You are a member of this cohort. You can add sacks, add and invite members.',
    isArchived: false,
    isDeleted: false,
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId, ...userIds],
    name: 'Cohort example - member',
    ownerIds: [userIds[0]]
  },
  {
    _id: ObjectId(),
    description:
      'You are a member of this cohort. You can add sacks, add and invite members.',
    isArchived: true,
    isDeleted: false,
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId],
    name: 'Archived cohort example',
    ownerIds: [demoUserId]
  }
];

module.exports = { generateCohorts };
