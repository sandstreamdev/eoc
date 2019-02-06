const express = require('express');

const router = express.Router();
const {
  addProductToList,
  createNewList,
  getAllShoppingLists,
  getProductsForGivenList,
  getShoppingListById,
  getShoppingListsMetaData
} = require('../controllers/shoppingList');
const { authorize } = require('../middleware/authorize');

router.get('/', authorize, getAllShoppingLists);
router.get('/meta-data', authorize, getShoppingListsMetaData);
router.get('/:id', authorize, getShoppingListById);
router.post('/create', authorize, createNewList);
router.post('/add-product', addProductToList);
router.get('/:id/get-products', getProductsForGivenList);

module.exports = app => app.use('/shopping-lists', router);
