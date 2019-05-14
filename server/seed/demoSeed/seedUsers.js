/* eslint-disable no-await-in-loop */
const User = require('../../models/user.model');
// require('dotenv').config();
const { generateUsers } = require('./generateUsers');

const seedUsers = async demoUserId => {
  const users = generateUsers(demoUserId);

  // eslint-disable-next-line no-unused-vars
  let counter = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const user of users) {
    const newUser = new User(user);

    await newUser.save();
    counter += 1;
  }
  return users;
};

module.exports = { seedUsers };
