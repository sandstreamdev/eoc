const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';
const ENDPOINT_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:3000';
const ListType = Object.freeze({
  LIMITED: 'limited',
  SHARED: 'shared'
});

module.exports = { DB_URL, ENDPOINT_URL, FRONTEND_URL, ListType };
