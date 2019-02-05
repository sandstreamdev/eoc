const mongoose = require('mongoose');

const { Schema } = mongoose;

const ShoppingListSchema = new Schema(
  {
    adminIds: [String],
    description: { type: String },
    items: [String],
    name: { type: String, required: true },
    ordererIds: [String],
    organizationIds: [String],
    purchaserIds: [String],
    visibility: { type: String }
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'shopping-lists' }
);

module.exports = mongoose.model('ShoppingListSchema', ShoppingListSchema);
