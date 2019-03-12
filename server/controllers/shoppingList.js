const ShoppingList = require('../models/shoppingList.model');
const Product = require('../models/item.model');
const { checkRole, filter } = require('../common/utilities');
const Cohort = require('../models/cohort.model');

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
        .status(400)
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
            message: `List "${doc.name}" successfully deleted.`
          })
        : resp.status(404).send({ message: 'List not found.' });
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
        return resp.status(400).send({
          message:
            'An error occurred while fetching the archived lists data. Please try again.'
        });
      }

      docs
        ? resp.status(200).json(docs)
        : resp.status(404).send({ message: 'No archived lists data found.' });
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
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while adding a new item. Please try again.'
        });
      }

      doc
        ? resp.status(200).send(product)
        : resp.status(404).send({ message: 'List  not found.' });
    }
  );
};

const getListData = (req, resp) => {
  let list;
  ShoppingList.findOne({
    _id: req.params.id,
    $or: [
      { adminIds: req.user._id },
      { ordererIds: req.user._id },
      { purchaserIds: req.user._id }
    ]
  })
    .then(doc => {
      if (!doc) {
        return resp.status(404).send({ message: 'List data not found.' });
      }

      list = doc;

      const { cohortId } = list;
      if (cohortId) {
        return Cohort.findOne({ _id: cohortId }).then(cohort => {
          if (!cohort || (cohort && cohort.isArchived)) {
            return resp.status(404).send({ message: 'List data not found.' });
          }
        });
      }
    })
    .then(() => {
      const {
        adminIds,
        cohortId,
        description,
        _id,
        isArchived,
        name,
        products
      } = list;

      if (isArchived) {
        return resp.status(200).json({ cohortId, _id, isArchived, name });
      }

      const isAdmin = checkRole(adminIds, req.user._id);

      const data = isAdmin
        ? { _id, cohortId, description, isAdmin, isArchived, name, products }
        : { _id, cohortId, description, isArchived, name, products };

      return resp.status(200).json(data);
    })
    .catch(err => {
      resp.status(400).send({
        message:
          'An error occurred while fetching the list data. Please try again.'
      });
    });
};

const updateShoppingListItem = (req, resp) => {
  const { isOrdered, itemId, voterIds } = req.body;
  const { id: listId } = req.params;

  /**
   * Create object with properties to update, but only these which
   * are passed in the request
   *  */
  const propertiesToUpdate = {};
  if (isOrdered !== undefined) {
    propertiesToUpdate['products.$.isOrdered'] = isOrdered;
  }
  if (voterIds) {
    propertiesToUpdate['products.$.voterIds'] = voterIds;
  }

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
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while updating the list data. Please try again.'
        });
      }
      const itemIndex = doc.products.findIndex(item => item._id.equals(itemId));
      const item = doc.products[itemIndex];

      doc
        ? resp.status(200).json(item)
        : resp.status(404).send({ message: 'List data not found.' });
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
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while updating the list data. Please try again.'
        });
      }

      doc
        ? resp
            .status(200)
            .send({ message: `List "${doc.name}" successfully updated.` })
        : resp.status(404).send({ message: 'List data not found.' });
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
