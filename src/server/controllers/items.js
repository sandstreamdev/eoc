const Item = require('../models/item.model');

// Get all the items
const getAllItems = function(req, resp) {
  switch (req.params.type) {
    case 'unordered':
      Item.find({ isOrdered: false }, (err, items) =>
        err ? resp.status(400).send(err.message) : resp.status(200).json(items)
      );
      break;
    case 'ordered':
      Item.find({ isOrdered: true }, (err, items) =>
        err ? resp.status(400).send(err.message) : resp.status(200).json(items)
      );
      break;
    default:
      Item.find({}, (err, items) =>
        err ? resp.status(400).send(err.message) : resp.status(200).json(items)
      );
  }
};

module.exports = {
  getAllItems
};
