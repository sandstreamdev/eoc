const ShoppingList = require('../models/shoppingList.model');
const Product = require('../models/item.model');
const filter = require('../common/utilities');

const createNewList = (req, resp) => {
  const { description, name, adminId } = req.body;

  const shoppingList = new ShoppingList({
    description,
    name,
    adminIds: adminId
  });

  shoppingList.save((err, doc) => {
    err
      ? resp.status(400).send({ message: err.message })
      : resp
          .location(`/shopping-list/${doc._id}`)
          .status(201)
          .send(doc);
  });
};

// Get all the lists
const getAllShoppingLists = (req, resp) => {
  ShoppingList.find(
    {
      $or: [
        { adminIds: req.user._id },
        { ordererIds: req.user._id },
        { purchaserIds: req.user._id }
      ]
    },
    null,
    { sort: { created_at: -1 } },
    (err, shoppingLists) => {
      err
        ? resp.status(400).send({ message: err.message })
        : resp.status(200).send(shoppingLists);
    }
  );
};

const getShoppingListById = (req, resp) => {
  ShoppingList.findById({ _id: req.params.id }, (err, doc) => {
    if (!doc) {
      return resp.status(404).send({ message: 'No shopping list of given id' });
    }

    return err
      ? resp.status(400).send({ message: err.message })
      : resp.status(200).json(doc);
  });
};

// Delete list by given id
const deleteListById = (req, resp) => {
  ShoppingList.findOneAndDelete(
    { _id: req.params.id, adminIds: req.user._id },
    (err, doc) => {
      if (!doc) {
        return resp.status(404).send({
          message:
            "No list of given id or you don't have permission to delete it"
        });
      }

      return err
        ? resp.status(400).send({
            message:
              "Oops we're sorry, an error occurred while deleting the list"
          })
        : resp.status(200).send({
            message: `List with id: ${req.params.id} was successfully deleted!`
          });
    }
  );
};

const getShoppingListsMetaData = (req, resp) => {
  ShoppingList.find(
    {
      $or: [
        { adminIds: req.user._id },
        { ordererIds: req.user._id },
        { purchaserIds: req.user._id }
      ]
    },
    '_id name description',
    { sort: { created_at: -1 } },
    (err, docs) => {
      err
        ? resp.status(404).send({ message: err.message })
        : resp.status(200).send(docs);
    }
  );
};

const addProductToList = (req, resp) => {
  const {
    product: { name, isOrdered, authorName, authorId, voterIds },
    listId
  } = req.body;

  const product = new Product({
    authorName,
    authorId,
    isOrdered,
    name,
    createdAt: new Date(Date.now()).toISOString(),
    voterIds
  });

  ShoppingList.findOneAndUpdate(
    {
      _id: listId,
      $or: [
        { adminIds: req.user._id },
        { ordererIds: req.user._id },
        { purchaserIds: req.user._id }
      ]
    },
    { $push: { products: product } },
    (err, data) => {
      err
        ? resp.status(404).send({ message: err.message })
        : resp.status(200).send(product);
    }
  );
};

const getProductsForGivenList = (req, resp) => {
  ShoppingList.find(
    {
      _id: req.params.id,
      $or: [
        { adminIds: req.user._id },
        { ordererIds: req.user._id },
        { purchaserIds: req.user._id }
      ]
    },
    'products',
    (err, documents) => {
      if (!documents) {
        return resp.status(404).send('Products not found for given list id!');
      }

      if (err) {
        return resp.status(404).send({ message: err.message });
      }

      const { products } = documents[0];
      resp.status(200).json(products);
    }
  );
};

const updateShoppingListItem = (req, resp) => {
  const { isOrdered, itemId, voterIds } = req.body;
  const { id: listId } = req.params;

  /**
   * Create object with properties to update, but only these which
   * are passed in the request
   *  */
  const propertiesToUpdate = {};
  typeof isOrdered !== 'undefined'
    ? (propertiesToUpdate['products.$.isOrdered'] = isOrdered)
    : null;
  voterIds ? (propertiesToUpdate['products.$.voterIds'] = voterIds) : null;

  ShoppingList.findOneAndUpdate(
    {
      _id: listId,
      'products._id': itemId,
      $or: [
        { adminIds: req.user._id },
        { ordererIds: req.user._id },
        { purchaserIds: req.user._id }
      ]
    },
    {
      $set: propertiesToUpdate
    },
    { new: true },
    (err, doc) => {
      const itemIndex = doc.products.findIndex(item => item._id.equals(itemId));
      const item = doc.products[itemIndex];
      err ? resp.status(404).send(err.message) : resp.status(200).json(item);
    }
  );
};

const updateListById = (req, resp) => {
  const { description, name } = req.body;
  const { id: listId } = req.params;
  const dataToUpdate = filter(x => x !== undefined)({
    description,
    name
  });

  ShoppingList.findOneAndUpdate(
    {
      _id: listId,
      $or: [{ adminIds: req.user._id }]
    },
    dataToUpdate,
    { new: true },
    (err, doc) => {
      if (!doc) {
        return resp.status(404).send({
          message: 'You dont have permissions to update this list'
        });
      }
      return err
        ? resp.status(400).send({
            message:
              "Oops we're sorry, an error occurred while updating the list"
          })
        : resp.status(200).send({
            message: `List with id: ${req.params.id} was successfully updated!`
          });
    }
  );
};

module.exports = {
  addProductToList,
  createNewList,
  deleteListById,
  getAllShoppingLists,
  getProductsForGivenList,
  getShoppingListById,
  getShoppingListsMetaData,
  updateListById,
  updateShoppingListItem
};
