const Item = require('../models/item.model');

// Create new item
const itemCreate = function(req, resp) {
  const { name, isOrdered } = req.body;
  const item = new Item({
    name,
    isOrdered
  });

  item.save((err, doc) => {
    err
      ? resp.status(400).send(err.message)
      : resp
          .status(201)
          .location(`/item/${doc._id}`)
          .send(`Product created successfuly! ${JSON.stringify(doc)}`);
  });
};

// Get item by given id
const getItemById = function(req, resp) {
  Item.findById(req.params.id, (err, product) => {
    err ? resp.status(400).send(err.message) : resp.status(200).json(product);
  });
};

// Delete item by given id
const deleteItemById = function(req, resp) {
  Item.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
    if (!doc) return resp.status(404).send('No item of given id');
    return err
      ? resp.status(400).send(err.message)
      : resp.status(204).send('Item was deleted!');
  });
};

module.exports = {
  deleteItemById,
  getItemById,
  itemCreate
};
