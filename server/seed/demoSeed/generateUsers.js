const mongoose = require('mongoose');

const {
  DEMO_MODE_ID: idFromProvider,
  DEMO_USER_ID: userId
} = require('../../common/variables');

const {
  Types: { ObjectId }
} = mongoose;

const createDemoUser = () => ({
  _id: userId,
  accessToken: '012346789',
  avatarUrl:
    'https://avatars.dicebear.com/v2/avataaars/eoc-demo%40examle.com.svg?options[top][]=longHair&options[top][]=shortHair&options[topChance]=100&options[hatColor][]=black&options[hairColor][]=brown&options[facialHair][]=medium&options[facialHairChance]=100&options[facialHairColor][]=brown&options[clothesColor][]=blue&options[eyes][]=defaultValue&options[mouth][]=smile&options[skin][]=brown',
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
    avatarUrl:
      'https://avatars.dicebear.com/v2/avataaars/eoc-joe-doe.com.svg?options[top][]=shortHair&options[top][]=longHair&options[hairColor][]=brown&options[clothesColor][]=red&options[eyes][]=defaultValue&options[mouth][]=defaultValue&options[skin][]=pale',
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
    avatarUrl:
      'https://avatars.dicebear.com/v2/avataaars/eoc-amanda-smith.com.svg?options[hairColor][]=black',
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
    avatarUrl:
      'https://avatars.dicebear.com/v2/avataaars/eoc-william-logan.com.svg?options[top][]=shortHair&options[hairColor][]=black&options[clothes][]=sweater&options[clothesColor][]=heather&options[eyes][]=happy&options[mouth][]=smile&options[skin][]=light',
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
    avatarUrl:
      'https://avatars.dicebear.com/v2/avataaars/eoc-joan-wood.com.svg?options[top][]=shortHair&options[top][]=longHair&options[hairColor][]=blonde&options[clothesColor][]=red&options[eyes][]=defaultValue&options[mouth][]=defaultValue&options[skin][]=pale',
    displayName: 'Joan Wood',
    email: 'joan.wood@example.uk',
    idFromProvider,
    name: 'Joan',
    provider: `demo-${demoUserId}`,
    surname: 'Wood'
  }
];

module.exports = { createDemoUser, generateUsers };
