const express = require('express');

const router = express.Router();
const {
  addProductToList,
  createNewList,
  getAllShoppingLists,
  getProductsForGivenList,
  getShoppingListById,
  getShoppingListsMetaData,
  updateShoppingListItem
} = require('../controllers/shoppingList');
const { authorize } = require('../middleware/authorize');

router.get('/', authorize, getAllShoppingLists);
router.get('/meta-data', authorize, getShoppingListsMetaData);
router.get('/:id', authorize, getShoppingListById);
router.post('/create', createNewList);
router.post('/add-product', authorize, addProductToList);
router.get('/:id/get-products', getProductsForGivenList);
router.patch('/:id/update-item', updateShoppingListItem);

module.exports = app => app.use('/shopping-lists', router);
