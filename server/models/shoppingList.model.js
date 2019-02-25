const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const ItemSchema = require('./item.model').schema;

const ShoppingListSchema = new Schema(
  {
    adminIds: [ObjectId],
    cohortId: {
      type: ObjectId,
      default: null
    },
    description: { type: String },
    products: [ItemSchema],
    name: { type: String, required: true },
    ordererIds: [ObjectId],
    purchaserIds: [ObjectId],
    visibility: { type: String }
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'shopping-lists' }
);

module.exports = mongoose.model('ShoppingListSchema', ShoppingListSchema);
