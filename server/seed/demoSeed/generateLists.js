const mongoose = require('mongoose');

const { generateItems } = require('./generateItems');

const {
  Types: { ObjectId }
} = mongoose;

const generateLists = (demoUserId, userIds, cohortIds, items) => [
  {
    _id: ObjectId(),
    cohortId: null,
    description: 'You are the owner of this private sack.',
    favIds: [demoUserId],
    isArchived: false,
    items: generateItems(demoUserId, userIds),
    memberIds: [demoUserId],
    name: 'Private sack example - owner',
    ownerIds: [demoUserId],
    type: 'limited',
    viewersIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    cohortId: null,
    description: 'You are the owner of this private sack.',
    favIds: [],
    isArchived: true,
    items: generateItems(demoUserId, userIds),
    memberIds: [demoUserId],
    name: 'Archive sack example',
    ownerIds: [demoUserId],
    type: 'limited',
    viewersIds: [demoUserId]
  },
  {
    _id: ObjectId(),
    cohortId: null,
    description: 'You are a member of this private sack.',
    favIds: [],
    isArchived: false,
    items: generateItems(demoUserId, userIds),
    memberIds: [demoUserId, ...userIds],
    name: 'Private sack example - member',
    ownerIds: [userIds[2]],
    type: 'limited',
    viewersIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    cohortId: null,
    description: 'You are a viewer of this private sack.',
    favIds: [],
    isArchived: false,
    items: generateItems(demoUserId, userIds),
    memberIds: [userIds[1]],
    name: 'Private sack example - viewer',
    ownerIds: [userIds[1]],
    type: 'limited',
    viewersIds: [demoUserId, userIds[1]]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description: "You are the owner of this cohort's limited sack.",
    favIds: [demoUserId],
    isArchived: false,
    items: generateItems(demoUserId, userIds),
    memberIds: [demoUserId, userIds[1]],
    name: 'Cohort sack example - owner',
    ownerIds: [demoUserId],
    type: 'limited',
    viewersIds: [demoUserId, userIds[1], userIds[2]]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description: "You are the owner of this cohort's shared sack.",
    favIds: [],
    isArchived: false,
    items: generateItems(demoUserId, userIds),
    memberIds: [demoUserId, userIds[1]],
    name: 'Cohort sack example - owner',
    ownerIds: [demoUserId],
    type: 'shared',
    viewersIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description: "You are the member of this cohort's limited sack.",
    favIds: [],
    isArchived: false,
    items: generateItems(demoUserId, userIds),
    memberIds: [demoUserId, userIds[3]],
    name: 'Cohort sack example - member',
    ownerIds: [userIds[3]],
    type: 'limited',
    viewersIds: [demoUserId, userIds[3], userIds[1]]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description: "You are the viewer of this cohort's limited sack.",
    favIds: [],
    isArchived: false,
    items: generateItems(demoUserId, userIds),
    memberIds: [userIds[2]],
    name: 'Cohort sack example - viewer',
    ownerIds: [userIds[2]],
    type: 'limited',
    viewersIds: [demoUserId, userIds[2]]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description: "You are the viewer of this cohort's shared sack.",
    favIds: [],
    isArchived: false,
    items: generateItems(demoUserId, userIds),
    memberIds: [userIds[0]],
    name: 'Cohort sack example - viewer',
    ownerIds: [userIds[0]],
    type: 'shared',
    viewersIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[1],
    description: 'You are the owner of this private sack.',
    favIds: [],
    isArchived: false,
    items: generateItems(demoUserId, userIds),
    memberIds: [demoUserId],
    name: 'Cohort sack example - owner',
    ownerIds: [demoUserId],
    type: 'limited',
    viewersIds: [demoUserId, userIds[0], userIds[1]]
  }
];

module.exports = { generateLists };
