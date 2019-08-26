const { DB_NAME, DB_URL } = require('./server/common/variables');

const config = {
  mongodb: {
    url: DB_URL,
    databaseName: DB_NAME,
    options: {
      useNewUrlParser: true
    }
  },
  migrationsDir: 'server/migrations/',
  changelogCollectionName: 'migrations'
};

module.exports = config;
