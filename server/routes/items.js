const express = require('express');

const router = express.Router();

const { getAllItems } = require('../controllers/items');

// Get all items
router.get('/:type?', getAllItems);

module.exports = app => app.use('/items', router);
