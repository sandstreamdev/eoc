const express = require('express');

const router = express.Router();

const {
  deleteItemById,
  itemCreate,
  getItemById
} = require('../controllers/item');

// Add new product
router.post('/create', itemCreate);

// Get product by id
router.get('/:id', getItemById);

// Delete product by id
router.delete('/:id/delete', deleteItemById);

module.exports = router;
