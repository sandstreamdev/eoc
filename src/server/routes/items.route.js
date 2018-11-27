const express = require('express');

const router = express.Router();

const itemsController = require('../controllers/items.controller');

// Get all items
router.get('/', itemsController);

module.exports = router;
