const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// schema
const ItemsList = new Schema(
  {
    desc: {
      type: String
    }
  },
  {
    collection: 'Items'
  }
);

module.exports = mongoose.model('ItemsList', ItemsList);
