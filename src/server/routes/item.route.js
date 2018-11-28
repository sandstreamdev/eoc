const express = require('express');

const router = express.Router();

const itemController = require('../controllers/item.controller');

// Add new product
router.post('/create', itemController.itemCreate);

// Get product by id
router.get('/:id', itemController.getItemById);

// Delete product by id
router.delete('/:id/delete', itemController.deleteItemById);

module.exports = router;
