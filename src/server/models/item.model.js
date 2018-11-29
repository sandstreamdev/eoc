const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  isOrdered: { type: Boolean, default: false }
});

module.exports = mongoose.model('Item', ItemSchema);
