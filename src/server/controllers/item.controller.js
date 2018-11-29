const Item = require('../models/item.model');

// Create new item
const itemCreate = function(req, resp) {
  const item = new Item({
    name: req.body.name,
    isOrdered: req.body.isOrdered
  });

  item.save(err => {
    if (err) return resp.status(400).send(err.message);
    return resp.status(200).send('Product created successfuly!');
  });
};

// Get item by given id
const getItemById = function(req, resp) {
  Item.findById(req.params.id, (err, product) => {
    if (err) return resp.status(400).send(err.message);
    return resp.status(200).json(product);
  });
};

// Delete item by given id
const deleteItemById = function(req, resp) {
  Item.find({ _id: req.params.id }).deleteOne((err, product) => {
    if (err) return resp.status(400).send(err.message);
    return resp.status(200).send(`${product.n} item/s deleted!`);
  });
};

module.exports = {
  deleteItemById,
  getItemById,
  itemCreate
};
