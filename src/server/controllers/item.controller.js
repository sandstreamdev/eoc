const Item = require('../models/item.model');

// Create new item
const itemCreate = function(req, resp) {
  const item = new Item({
    name: req.body.name,
    isOrdered: req.body.isOrdered
  });

  item.save(err => {
    if (err) return console.error(err);
    return resp.send('Product created successfuly!');
  });
};

// Get item by given id
const getItemById = function(req, resp) {
  Item.findById(req.params.id, (err, product) => {
    if (err) return console.error(err);
    return resp.send(product);
  });
};

// Delete item by given id
const deleteItemById = function(req, resp) {
  Item.findOneAndRemove(req.params.id, (err, product) => {
    if (err) return console.error(err);
    return resp.send(`${product.name} deleted succesfully!`);
  });
};

module.exports = {
  itemCreate,
  getItemById,
  deleteItemById
};
