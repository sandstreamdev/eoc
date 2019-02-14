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

  Item.find(findConditions, null, { sort: { createdAt: -1 } }, (err, items) =>
    err
      ? resp.status(400).send({ message: err.message })
      : resp.status(200).json(items)
  );
};

module.exports = {
  getAllItems
};
