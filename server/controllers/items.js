const Item = require('../models/item.model');

// Get all the items
const getAllItems = (req, resp) => {
  let findConditions;
  switch (req.params.type) {
    case 'ordered':
      findConditions = { isOrdered: true };
      break;
    case 'unordered':
      findConditions = { isOrdered: false };
      break;
    default:
      findConditions = {};
  }

  Item.find(findConditions, (err, items) =>
    err ? resp.status(400).send(err.message) : resp.status(200).json(items)
  );
};

module.exports = {
  getAllItems
};
