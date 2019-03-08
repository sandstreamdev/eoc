const ShoppingList = require('../models/shoppingList.model');
const Product = require('../models/item.model');
const filter = require('../common/utilities');

const createList = (req, resp) => {
  const { description, name, adminId, cohortId } = req.body;

  const list = new ShoppingList({
    description,
    name,
    adminIds: adminId,
    cohortId
  });

  list.save((err, doc) => {
    if (err) {
      return resp
        .status(404)
        .send({ message: 'List not saved. Please try again.' });
    }

    const { _id, description, name } = doc;
    const data = cohortId
      ? { _id, description, name, cohortId }
      : { _id, description, name };
    resp
      .status(201)
      .location(`/shopping-lists/${doc._id}`)
      .send(data);
  });
};

const deleteListById = (req, resp) => {
  ShoppingList.findOneAndDelete(
    { _id: req.params.id, adminIds: req.user._id },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while deleting the list. Please try again.'
        });
      }

      doc
        ? resp.status(200).send({
            message: `List ${doc.name} successfully deleted.`
          })
        : resp.status(404).send({ message: `List ${doc.name} not found` });
    }
  );
};

const getShoppingListsMetaData = (req, resp) => {
  const { cohortId } = req.params;

  ShoppingList.find(
    {
      cohortId,
      $or: [
        { adminIds: req.user._id },
        { ordererIds: req.user._id },
        { purchaserIds: req.user._id }
      ],
      isArchived: false
    },
    `_id name description ${cohortId ? 'cohortId' : ''}`,
    (err, docs) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while fetching the lists data. Please try again.'
        });
      }

      docs
        ? resp.status(200).json(docs)
        : resp.status(404).send({ message: 'No lists data found.' });
    }
  );
};

const getArchivedListsMetaData = (req, resp) => {
  ShoppingList.find(
    {
      $or: [
        { adminIds: req.user._id },
        { ordererIds: req.user._id },
        { purchaserIds: req.user._id }
      ],
      cohortId: { $eq: null },
      isArchived: true
    },
    '_id name description isArchived',
    { sort: { created_at: -1 } },
    (err, docs) => {
      if (err) {
        return resp.status(404).send({ message: err.message });
      }
      if (!docs) {
        return resp.status(404).send('There is no archived lists!');
      }
      resp.status(200).send(docs);
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

const getListData = (req, resp) => {
  ShoppingList.find(
    {
      _id: req.params.id,
      $or: [
        { adminIds: req.user._id },
        { ordererIds: req.user._id },
        { purchaserIds: req.user._id }
      ]
    },
    (err, documents) => {
      if (err) {
        return resp.status(404).send({ message: err.message });
      }

      if (documents && documents.length > 0) {
        const { cohortId, _id, isArchived } = documents[0];

        if (isArchived) {
          return resp.status(200).json({ cohortId, _id, isArchived });
        }

        return resp.status(200).json(documents[0]);
      }

      return resp
        .status(404)
        .send({ message: 'Products not found for given list id!' });
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
  const { description, isArchived, name } = req.body;
  const { id: listId } = req.params;
  const dataToUpdate = filter(x => x !== undefined)({
    description,
    isArchived,
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
          message: 'You have no permissions to perform this action.'
        });
      }
      return err
        ? resp.status(400).send({
            message:
              "Oops we're sorry, an error occurred while processing the list."
          })
        : resp.status(200).send({
            message: `List "${doc.name}" was successfully updated!`
          });
    }
  );
};

module.exports = {
  addProductToList,
  createList,
  deleteListById,
  getArchivedListsMetaData,
  getListData,
  getShoppingListsMetaData,
  updateListById,
  updateShoppingListItem
};
