const express = require('express');

const router = express.Router();

const itemsController = require('../controllers/items.controller');

// Get all items
router.get('/', itemsController.getAllItems);

// Get ordered items
router.get('/ordered', itemsController.getOrderedItems);

// Get unordered items
router.get('/unordered', itemsController.getAllUnordered);

module.exports = router;
