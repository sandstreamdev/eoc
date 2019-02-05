const express = require('express');

const router = express.Router();
const {
  createNewList,
  getAllShoppingLists,
  getShoppingListById
} = require('../controllers/shoppingList');
const { authorize } = require('../middleware/authorize');

router.get('/', authorize, getAllShoppingLists);
router.get('/:id', authorize, getShoppingListById);
router.post('/create', authorize, createNewList);

module.exports = app => app.use('/shopping-lists', router);
