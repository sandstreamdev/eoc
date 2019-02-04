const ShoppingList = require('../models/shoppingList.model');

const createNewList = (req, resp) => {
  const { description, name, adminIds } = req.body;

  const shoppingList = new ShoppingList({
    description,
    name,
    adminIds
  });

  shoppingList.save((err, doc) => {
    err
      ? resp.status(400).send(err.message)
      : resp
          .location(`/shopping-list/${doc._id}`)
          .status(201)
          .send(doc);
  });
};

// Get all the lists
const getAllShoppingLists = (req, resp) => {
  ShoppingList.find(
    {},
    null,
    { sort: { created_at: -1 } },
    (err, shoppingLists) => {
      err
        ? resp.status(400).send(err.message)
        : resp.status(200).send(shoppingLists);
    }
  );
};

const getShoppingListById = (req, resp) => {
  ShoppingList.findById({ _id: req.params.id }, (err, doc) => {
    if (!doc) return resp.status(404).send('No shopping list of given id');

    return err
      ? resp.status(400).send(err.message)
      : resp.status(200).json(doc);
  });
};

module.exports = {
  createNewList,
  getAllShoppingLists,
  getShoppingListById
};
