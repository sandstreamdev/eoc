const express = require('express');

const router = express.Router();

const {
  deleteItemById,
  itemCreate,
  getItemById,
  updateItem
} = require('../controllers/item');
const { authorize } = require('../middleware/authorize');

router.post('/create', authorize, itemCreate);
router.get('/:id', authorize, getItemById);
router.delete('/:id/delete', authorize, deleteItemById);
router.patch('/:id/update', authorize, updateItem);

module.exports = app => app.use('/item', router);
