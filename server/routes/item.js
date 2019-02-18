const express = require('express');

const router = express.Router();

const {
  deleteItemById,
  itemCreate,
  getItemById,
  updateItem
} = require('../controllers/item');
const { authorize } = require('../middleware/authorize');

// Add new product
router.post('/create', authorize, itemCreate);

// Get product by id
router.get('/:id', authorize, getItemById);

// Delete product by id
router.delete('/:id/delete', authorize, deleteItemById);

// Update product by id
router.patch('/:id/update', authorize, updateItem);

module.exports = app => app.use('/item', router);
