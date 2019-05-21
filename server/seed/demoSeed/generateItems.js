const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

const generateItems = (demoUserId, userIds) => [
  {
    _id: ObjectId(),
    authorId: demoUserId,
    description: '',
    isOrdered: false,
    link: '',
    name: 'Task 1',
    voterIds: [demoUserId, ...userIds]
  },
  {
    _id: ObjectId(),
    authorId: userIds[0],
    description: '',
    isOrdered: false,
    link: '',
    name: 'Task 2',
    voterIds: [userIds[0], userIds[1], userIds[2]]
  },
  {
    _id: ObjectId(),
    authorId: demoUserId,
    description: '',
    isOrdered: true,
    link: '',
    name: 'Task 3',
    voterIds: [demoUserId, userIds[2]]
  },
  {
    _id: ObjectId(),
    authorId: userIds[3],
    description: '',
    isOrdered: true,
    link: '',
    name: 'Task 4',
    voterIds: [...userIds]
  }
];

module.exports = { generateItems };
