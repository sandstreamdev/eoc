const mongoose = require('mongoose');

const { Schema } = mongoose;

const ShoppingListSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    adminIds: Schema.Types.String,
    ordererIds: Schema.Types.String,
    purchaserIds: Schema.Types.String,
    visibility: { type: String },
    organizationIds: Schema.Types.String,
    items: Schema.Types.Mixed
  },
  { collection: 'shopping-lists' }
);

module.exports = mongoose.model('ShoppingListSchema', ShoppingListSchema);
