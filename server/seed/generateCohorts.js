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
      adminIds: [userId],
      description: '',
      isArchived: false,
      memberIds: [],
      name: `Cohort ${i}`
    });
  }

  return data;
};

module.exports = { generateCohorts };
