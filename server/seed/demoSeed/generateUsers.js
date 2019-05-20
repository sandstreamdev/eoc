const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

const {
  DEMO_USER_ID_FROM_PROVIDER: idFromProvider,
  DEMO_USER_ID: userId
} = process.env;

const createDemoUser = () => ({
  _id: userId,
  accessToken: '012346789',
  avatarUrl: 'https://i.pravatar.cc/40?img=1',
  displayName: 'Demo',
  email: 'demo@example.com',
  idFromProvider,
  name: 'Demo',
  provider: `demo-${userId}`,
  surname: 'User'
});

const generateUsers = demoUserId => [
  {
    _id: ObjectId(),
    accessToken: '012346789',
    avatarUrl: 'https://i.pravatar.cc/40?img=3',
    displayName: 'John Doe',
    email: 'john@doe.com',
    idFromProvider,
    name: 'John',
    provider: `demo-${demoUserId}`,
    surname: 'Doe'
  },
  {
    _id: ObjectId(),
    accessToken: '012346789',
    avatarUrl: 'https://i.pravatar.cc/40?img=5',
    displayName: 'Amanda Smith',
    email: 'amanda.smith@example.com',
    idFromProvider,
    name: 'Amanda',
    provider: `demo-${demoUserId}`,
    surname: 'Smith'
  },
  {
    _id: ObjectId(),
    accessToken: '012346789',
    avatarUrl: 'https://i.pravatar.cc/40?img=7',
    displayName: 'William Logan',
    email: 'wlogan@test.pl',
    idFromProvider,
    name: 'William',
    provider: `demo-${demoUserId}`,
    surname: 'Logan'
  },
  {
    _id: ObjectId(),
    accessToken: '012346789',
    avatarUrl: 'https://i.pravatar.cc/40?img=9',
    displayName: 'Joan Wood',
    email: 'joan.wood@example.uk',
    idFromProvider,
    name: 'Joan',
    provider: `demo-${demoUserId}`,
    surname: 'Wood'
  }
];

module.exports = { createDemoUser, generateUsers };
