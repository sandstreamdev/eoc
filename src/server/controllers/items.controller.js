const Item = require('../models/item.model');

// Get all the items
const getAllItems = function(req, resp) {
  Item.find({}, (err, items) => {
    if (err) return console.error(err);

    return resp.send(items);
  });
};

module.exports = getAllItems;
