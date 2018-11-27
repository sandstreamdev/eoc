const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: String,
  isOrdered: Boolean
});

module.exports = mongoose.model('Item', ItemSchema);
