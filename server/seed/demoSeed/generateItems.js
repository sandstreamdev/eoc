const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

const generateItems = (demoUserId, userIds) => [
  {
    _id: ObjectId(),
    authorId: demoUserId,
    description: '',
    done: false,
    editedBy: userIds[1],
    isArchived: false,
    isDeleted: false,
    locks: {
      description: false,
      name: false
    },
    name: 'Task 1',
    purchaserId: '',
    voterIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    authorId: userIds[0],
    description: '',
    done: false,
    editedBy: userIds[1],
    isArchived: false,
    isDeleted: false,
    locks: {
      description: false,
      name: false
    },
    name: 'Task 2',
    voterIds: [userIds[0], userIds[1], userIds[2]]
  },
  {
    _id: ObjectId(),
    authorId: demoUserId,
    description: '',
    done: false,
    editedBy: userIds[1],
    isArchived: false,
    isDeleted: false,
    locks: {
      description: false,
      name: false
    },
    name: 'Task 3',
    voterIds: [demoUserId, userIds[2]]
  },
  {
    _id: ObjectId(),
    authorId: userIds[3],
    description: '',
    done: false,
    editedBy: userIds[1],
    isArchived: false,
    isDeleted: false,
    locks: {
      description: false,
      name: false
    },
    name: 'Task 4',
    voterIds: [...userIds]
  }
];

module.exports = { generateItems };
