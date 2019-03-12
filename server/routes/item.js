const express = require('express');

const router = express.Router();

const {
  deleteItemById,
  itemCreate,
  getItemById,
  updateItem
} = require('../controllers/item');
const { authorize } = require('../middleware/authorize');

// Add new item
router.post('/create', authorize, itemCreate);

// Get item by id
router.get('/:id', authorize, getItemById);

// Delete item by id
router.delete('/:id/delete', authorize, deleteItemById);

// Update item by id
router.patch('/:id/update', authorize, updateItem);

module.exports = app => app.use('/item', router);
