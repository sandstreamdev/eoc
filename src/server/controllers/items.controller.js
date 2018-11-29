const Item = require('../models/item.model');

// Get all the items
const getAllItems = function(req, resp) {
  Item.find({}, (err, items) =>
    err ? resp.status(400).send(err.message) : resp.status(200).json(items)
  );
};

// Get all ordered items
const getOrderedItems = function(req, resp) {
  Item.find({ isOrdered: true }, (err, items) =>
    err ? resp.status(400).send(err.message) : resp.status(200).json(items)
  );
};

// Get all unordered items
const getAllUnordered = function(req, resp) {
  Item.find({ isOrdered: false }, (err, items) =>
    err ? resp.status(400).send(err.message) : resp.status(200).json(items)
  );
};

module.exports = {
  getAllItems,
  getAllUnordered,
  getOrderedItems
};
