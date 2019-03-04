const express = require('express');

const router = express.Router();
const {
  addProductToList,
  createList,
  deleteListById,
  getAllShoppingLists,
  getArchivedListsMetaData,
  getListData,
  getShoppingListById,
  getShoppingListsMetaData,
  updateListById,
  updateShoppingListItem
} = require('../controllers/shoppingList');
const { authorize } = require('../middleware/authorize');

router.get('/', authorize, getAllShoppingLists);
router.get('/meta-data/:cohortId?', authorize, getShoppingListsMetaData);
router.get('/archived', authorize, getArchivedListsMetaData);
router.get('/:id', authorize, getShoppingListById);
router.post('/create', authorize, createList);
router.post('/add-product', authorize, addProductToList);
router.delete('/:id/delete', authorize, deleteListById);
router.patch('/:id/update', authorize, updateListById);
router.get('/:id/data', authorize, getListData);
router.patch('/:id/update-item', authorize, updateShoppingListItem);

module.exports = app => app.use('/shopping-lists', router);
