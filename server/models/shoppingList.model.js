const mongoose = require('mongoose');

const { Schema } = mongoose;
const ItemSchema = require('./item.model').schema;

const ShoppingListSchema = new Schema(
  {
    adminIds: [String],
    description: { type: String },
    isArchived: { type: Boolean, default: false },
    name: { type: String, required: true },
    ordererIds: [String],
    organizationIds: [String],
    products: [ItemSchema],
    purchaserIds: [String],
    visibility: { type: String }
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'shopping-lists' }
);

module.exports = mongoose.model('ShoppingListSchema', ShoppingListSchema);
