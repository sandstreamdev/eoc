const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;
const userId = process.env.USER_ID;

const generateCohorts = length => {
  const data = [];
  for (let i = 1; i <= length; i += 1) {
    data.push({
      _id: ObjectId(),
      description: '',
      isArchived: false,
      isDeleted: false,
      locks: {
        description: false,
        name: false
      },
      memberIds: [],
      name: `Cohort ${i}`,
      ownerIds: [userId]
    });
  }

  return data;
};

module.exports = { generateCohorts };
