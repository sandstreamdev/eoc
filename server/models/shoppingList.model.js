const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    authorName: { type: String, required: true },
    authorId: { type: String, required: true },
    comment: { type: String },
    isOrdered: { type: Boolean, default: false },
    name: { type: String, required: true },
    purchaserId: { type: String },
    status: { type: String },
    voterIds: [{ type: String }]
  },
  { timestamps: { createdAt: 'createdAt' } }
);

const ShoppingListSchema = new Schema(
  {
    adminIds: [String],
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
