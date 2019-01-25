const express = require('express');

const router = express.Router();

const {
  deleteItemById,
  itemCreate,
  getItemById,
  updateItem
} = require('../controllers/item');

// Add new product
router.post('/create', itemCreate);

// Get product by id
router.get('/:id', getItemById);

// Delete product by id
router.delete('/:id/delete', deleteItemById);

// Update product by id
router.patch('/:id/update', updateItem);

module.exports = app => app.use('/item', router);
