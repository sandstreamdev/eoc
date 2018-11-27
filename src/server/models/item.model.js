const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Item', ItemSchema);
