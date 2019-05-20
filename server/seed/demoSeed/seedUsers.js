const User = require('../../models/user.model');
const { generateUsers } = require('./generateUsers');

const seedUsers = demoUserId => {
  const users = generateUsers(demoUserId);
  const pendingUsers = users.map(user => new User(user).save());

  return Promise.all(pendingUsers).then(() => users);
};

module.exports = { seedUsers };
