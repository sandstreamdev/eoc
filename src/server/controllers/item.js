const Item = require('../models/item.model');
const filter = require('../common/utilities');

// Create new item
const itemCreate = (req, resp) => {
  const { name, isOrdered } = req.body;
  const item = new Item({
    name,
    isOrdered
  });

  item.save((err, doc) => {
    err
      ? resp.status(400).send(err.message)
      : resp
          .location(`/item/${doc._id}`)
          .status(201)
          .send(`Product created successfuly! ${JSON.stringify(doc)}`);
  });
};

// Get item by given id
const getItemById = (req, resp) => {
  Item.findById(req.params.id, (err, product) => {
    err ? resp.status(400).send(err.message) : resp.status(200).json(product);
  });
};

// Delete item by given id
const deleteItemById = (req, resp) => {
  Item.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
    if (!doc) return resp.status(404).send('No item of given id');
    return err
      ? resp.status(400).send(err.message)
      : resp.status(204).send(`Item with _ID: ${req.params.id} deleted!`);
  });
};

// Update item by given id
const updateItem = (req, resp) => {
  const { name, isOrdered } = req.body;

  const newData = filter(x => x !== undefined)({ name, isOrdered });

  Item.findOneAndUpdate({ _id: req.params.id }, newData, (err, doc) => {
    if (!doc) return resp.status(404).send('No item of given id');
    return err
      ? resp.status(400).send(err.message)
      : resp.status(200).send(`Item with _ID: ${req.params.id} updated!`);
  });
};

module.exports = {
  deleteItemById,
  getItemById,
  itemCreate,
  updateItem
};
