const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  author: { type: String, required: true },
  isOrdered: { type: Boolean, default: false },
  name: { type: String, required: true }
});

module.exports = mongoose.model('Item', ItemSchema);
