const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

const generateCohorts = (demoUserId, userIds) => [
  {
    _id: ObjectId(),
    description: 'You are the owner of this cohort.',
    favIds: [],
    isArchived: false,
    memberIds: [demoUserId, ...userIds],
    name: 'Cohort example - owner',
    ownerIds: [demoUserId]
  },
  {
    _id: ObjectId(),
    description: 'You are a member of this cohort.',
    favIds: [],
    isArchived: false,
    memberIds: [demoUserId, ...userIds],
    name: 'Cohort example - member',
    ownerIds: [userIds[0]]
  },
  {
    _id: ObjectId(),
    description: 'You are a member of this cohort.',
    favIds: [],
    isArchived: true,
    memberIds: [demoUserId],
    name: 'Archived cohort example',
    ownerIds: [demoUserId]
  }
];

module.exports = { generateCohorts };
