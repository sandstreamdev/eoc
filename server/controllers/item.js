const Item = require('../models/item.model');
const filter = require('../common/utils/utilities');

const itemCreate = (req, resp) => {
  const { authorName, authorId, isOrdered, name, voterIds } = req.body;
  const item = new Item({
    authorName,
    authorId,
    isOrdered,
    name,
    createdAt: new Date(Date.now()).toISOString(),
    voterIds
  });

  item.save((err, doc) => {
    err
      ? resp.status(400).send({ message: err.message })
      : resp
          .location(`/item/${doc._id}`)
          .status(201)
          .send(doc);
  });
};

const getItemById = (req, resp) => {
  Item.findById(req.params.id, (err, item) => {
    err ? resp.status(400).send(err.message) : resp.status(200).json(item);
  });
};

const deleteItemById = (req, resp) => {
  Item.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
    if (!doc) return resp.status(404).send('No item of given id');
    return err
      ? resp.status(400).send(err.message)
      : resp.status(204).send(`Item with _ID: ${req.params.id} deleted!`);
  });
};

const updateItem = (req, resp) => {
  const { name, isOrdered, author, voterIds } = req.body;
  const newData = filter(x => x !== undefined)({
    name,
    isOrdered,
    author,
    createdAt: new Date(Date.now()).toISOString(),
    voterIds
  });

  Item.findOneAndUpdate(
    { _id: req.params.id },
    newData,
    { new: true },
    (err, doc) => {
      if (!doc) {
        return resp.status(404).send({ message: 'No item of given id' });
      }
      return err
        ? resp.status(400).send({ message: 'Updating item failed...' })
        : resp.status(200).send({ message: 'Updating success' });
    }
  );
};

module.exports = {
  deleteItemById,
  getItemById,
  itemCreate,
  updateItem
};
