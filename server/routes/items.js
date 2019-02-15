const express = require('express');

const router = express.Router();

const { getAllItems } = require('../controllers/items');
const { authorize } = require('../middleware/authorize');

// Get all items
router.get('/:type?', authorize, getAllItems);

module.exports = app => app.use('/items', router);
