const mongoose = require('mongoose');

const { Schema } = mongoose;
const ItemSchema = require('./item.model').schema;

const ShoppingListSchema = new Schema(
  {
    adminIds: [String],
    cohortId: { type: String, default: '' },
    description: { type: String },
    products: [ItemSchema],
    name: { type: String, required: true },
    ordererIds: [String],
    organizationIds: [String],
    purchaserIds: [String],
    visibility: { type: String }
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'shopping-lists' }
);

module.exports = mongoose.model('ShoppingListSchema', ShoppingListSchema);
