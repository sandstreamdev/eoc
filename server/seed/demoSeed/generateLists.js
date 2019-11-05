const mongoose = require('mongoose');

const { generateItems } = require('./generateItems');
const { ListType } = require('../../common/variables');

const {
  Types: { ObjectId }
} = mongoose;

const generateLists = (demoUserId, userIds, cohortIds, items) => [
  {
    _id: ObjectId(),
    cohortId: null,
    description:
      'You are the owner of this private sack. You can modify and archive the sack, add items and modify them, add members and change their permissions.',
    favIds: [demoUserId],
    isArchived: false,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '🍅 Tomato',
      '🥓 Bacon',
      '🧅 Onion',
      '🧀 Cheese'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId],
    name: '🍕 Pizza',
    ownerIds: [demoUserId],
    type: ListType.LIMITED,
    viewersIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    cohortId: null,
    description:
      'You are the owner of this private sack. You can modify and archive the sack, add items and modify them, add members and change their permissions.',
    favIds: [],
    isArchived: true,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '⛺ Tent',
      '🧗‍ Equipment',
      '🗺️ Map',
      '🎒 Backpack'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId],
    name: '🏕 Trip',
    ownerIds: [demoUserId],
    type: ListType.LIMITED,
    viewersIds: [demoUserId]
  },
  {
    _id: ObjectId(),
    cohortId: null,
    description:
      'You are a member of this private sack. You can add and modify items, add members. You can not modify and archive sack, change members permissions.',
    favIds: [],
    isArchived: false,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '🛒 Shopping',
      '🧹 Tidy',
      '📧 Send emails',
      '🎪 Buy tickets to circus'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId, ...userIds],
    name: '✅ To Do',
    ownerIds: [userIds[2]],
    type: ListType.LIMITED,
    viewersIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    cohortId: null,
    description:
      'You are a viewer of this private sack. You can only view sack, items and members. You can not modify sack, items or members.',
    favIds: [],
    isArchived: false,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '🧸 Teddy Bear',
      '🎸 Guitar',
      '🛹 Skateboard',
      '🍫 Chocolate'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [userIds[1]],
    name: '🎁 Gifts',
    ownerIds: [userIds[1]],
    type: ListType.LIMITED,
    viewersIds: [demoUserId, userIds[1]]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description:
      "You are the owner of this cohort's limited sack. You can modify and archive the sack, add items and modify them, add members and change their permissions. This sack is limited, so it means that you have to add members manually.",
    favIds: [demoUserId],
    isArchived: false,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '👥 People management',
      '📱 Flutter',
      '💡 Elm language',
      '📈 SEO'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId, userIds[1]],
    name: '💡📖 Courses',
    ownerIds: [demoUserId],
    type: ListType.LIMITED,
    viewersIds: [demoUserId, userIds[1], userIds[2]]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description:
      "You are the owner of this cohort's shared sack. You can modify and archive the sack, add items and modify them, add members and change their permissions. This sack is shared, so it means that here are all cohort members.",
    favIds: [],
    isArchived: false,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '☕ Coffee',
      '🥛 Milk',
      '🍇 Fruits',
      '🧂 Salt'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId, userIds[1]],
    name: '🍵 Grocery list',
    ownerIds: [demoUserId],
    type: ListType.SHARED,
    viewersIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description:
      "You are the member of this cohort's limited sack. You can add and modify items, add members. You can not modify and archive sack, change members permissions. This sack is limited, so it means that you have to add members manually.",
    favIds: [],
    isArchived: false,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '📎 Paperclips',
      '📃 Printer paper',
      '🖊️ Pens',
      '📓 Notebooks'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId, userIds[3]],
    name: '🖨️ Office stuff',
    ownerIds: [userIds[3]],
    type: ListType.LIMITED,
    viewersIds: [demoUserId, userIds[3], userIds[1]]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description:
      "You are the viewer of this cohort's limited sack. You can only view sack, items and members. You can not modify sack, items or members. This sack is limited, so it means that here are only members that were added.",
    favIds: [],
    isArchived: false,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '📗 Functional Programming',
      '📙 The Linux Command Line',
      '📘 Algorithms & Data Structures',
      '📕 MySQL'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [userIds[2]],
    name: '📚 Books',
    ownerIds: [userIds[2]],
    type: ListType.LIMITED,
    viewersIds: [demoUserId, userIds[2]]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[0],
    description:
      "You are the viewer of this cohort's shared sack. You can only view sack, items and members. You can not modify sack, items or members. This sack is shared, so it means that here are all cohort members.",
    favIds: [],
    isArchived: false,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '🎱 Snooker',
      '🎮 FIFA tournament',
      '🎤 Karaoke',
      '♟️ Chess'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [userIds[0]],
    name: '🎲 🎮 Entertainment',
    ownerIds: [userIds[0]],
    type: ListType.SHARED,
    viewersIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    cohortId: cohortIds[1],
    description:
      'You are the owner of this private sack. You can modify and archive the sack, add items and modify them, add members and change their permissions. This sack is limited, so it means that you have to add members manually.',
    favIds: [],
    isArchived: false,
    isDeleted: false,
    items: generateItems(demoUserId, userIds, [
      '🎂 Birthday cake',
      '🍾 Champagne',
      '🎈 Balloons',
      '🎁 Gift'
    ]),
    locks: {
      description: false,
      name: false
    },
    memberIds: [demoUserId],
    name: '🎉 Birthday party',
    ownerIds: [demoUserId],
    type: ListType.LIMITED,
    viewersIds: [demoUserId, userIds[0], userIds[1]]
  }
];

module.exports = { generateLists };
