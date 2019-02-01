const mongoose = require('mongoose');

const { Schema } = mongoose;

const ShoppingListSchema = new Schema(
  {
    adminIds: [String],
    authorId: { type: String },
    cohortId: { type: String },
    description: { type: String },
    itemIds: [String],
    name: { type: String, required: true },
    ordererIds: [String],
    purchaserIds: [String],
    visibility: { type: String }
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'shopping-lists' }
);

module.exports = mongoose.model('ShoppingListSchema', ShoppingListSchema);
