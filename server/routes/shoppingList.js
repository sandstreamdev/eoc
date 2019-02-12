const express = require('express');

const router = express.Router();
const {
  addProductToList,
  createNewList,
  deleteListById,
  getAllShoppingLists,
  getProductsForGivenList,
  getShoppingListById,
  getShoppingListsMetaData,
  updateListById,
  updateShoppingListItem
} = require('../controllers/shoppingList');
const { authorize } = require('../middleware/authorize');

router.get('/', authorize, getAllShoppingLists);
router.get('/meta-data', authorize, getShoppingListsMetaData);
router.get('/:id', authorize, getShoppingListById);
router.post('/create', createNewList);
router.post('/add-product', authorize, addProductToList);
router.delete('/:id/delete', authorize, deleteListById);
router.patch('/:id/update', authorize, updateListById);
router.get('/:id/products', authorize, getProductsForGivenList);
router.patch('/:id/update-item', authorize, updateShoppingListItem);

module.exports = app => app.use('/shopping-lists', router);
