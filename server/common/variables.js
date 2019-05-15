const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/eoc';
const ListType = Object.freeze({
  LIMITED: 'limited',
  SHARED: 'shared'
});

module.exports = { DB_URL, ListType };
