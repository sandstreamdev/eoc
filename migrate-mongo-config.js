const config = {
  mongodb: {
    url: 'mongodb://localhost:27017',
    databaseName: 'eoc',
    options: {
      useNewUrlParser: true
    }
  },
  migrationsDir: 'server/migrations/',
  changelogCollectionName: 'migrations'
};

module.exports = config;
