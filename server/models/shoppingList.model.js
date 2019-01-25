const mongoose = require('mongoose');

const { Schema } = mongoose;

const ShoppingListSchema = new Schema(
  {
    adminIds: Schema.Types.String,
    description: { type: String },
    items: Schema.Types.Mixed,
    name: { type: String, required: true },
    ordererIds: Schema.Types.String,
    organizationIds: Schema.Types.String,
    purchaserIds: Schema.Types.String,
    visibility: { type: String }
  },
  { timestamps: { createdAt: 'created_at' } },
  { collection: 'shopping-lists' }
);

module.exports = mongoose.model('ShoppingListSchema', ShoppingListSchema);
