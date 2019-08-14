/* eslint-disable no-console */
const mongoose = require('mongoose');

const { DB_URL } = require('../common/variables');
const List = require('../models/list.model');
const {
  queryNonExistingSchemaField,
  setNonExistingSchemaField
} = require('../common/utils/index');

// This connectDatabase and disconnectDatabase will go to common/helpers
const connectDatabase = () =>
  mongoose
    .connect(DB_URL, { useNewUrlParser: true })
    .then(() => console.info('Connected to db...'))
    .catch(() => process.exit(1));

const disconnectDatabase = () =>
  mongoose
    .disconnect()
    .then(() => console.log('Successfully disconnected...'))
    .catch(() => process.exit(1));

const migrateListModel = () => {
  connectDatabase()
    .then(() => {
      const ListSchema = mongoose.modelSchemas.List.obj;
      const ListSchemaFields = Object.keys(ListSchema);

      ListSchemaFields.map(field => {
        const queryField = queryNonExistingSchemaField(field);
        const setField = setNonExistingSchemaField(field, ListSchema);

        return List.updateMany(queryField, setField)
          .lean()
          .exec()
          .then(() => console.log('Successfully migrated list model...'))
          .catch(err => {
            throw err;
          })
          .finally(() => disconnectDatabase());
      });
    })
    .catch(err => {
      console.log('Something went terribly wrong:', err);
      process.exit(1);
    });
};
/* eslint-enable no-console */

migrateListModel();
