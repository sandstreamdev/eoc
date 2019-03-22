const express = require('express');

const router = express.Router();
const {
  addItemToList,
  createList,
  deleteListById,
  getArchivedListsMetaData,
  getListData,
  getListsMetaData,
  handleFavourite,
  updateListById,
  updateListItem,
  voteForItem
} = require('../controllers/list');
const { authorize } = require('../middleware/authorize');

router.get('/meta-data/:cohortId?', authorize, getListsMetaData);
router.get('/archived/:cohortId?', authorize, getArchivedListsMetaData);
router.post('/create', authorize, createList);
router.post('/add-item', authorize, addItemToList);
router.delete('/:id/delete', authorize, deleteListById);
router.patch('/:id/update', authorize, updateListById);
router.get('/:id/data', authorize, getListData);
router.patch('/:id/update-item', authorize, updateListItem);
router.patch('/:id/vote-for-item', authorize, voteForItem);
router.patch('/:id/add-to-fav', authorize, handleFavourite);
router.patch('/:id/remove-from-fav', authorize, handleFavourite);

module.exports = app => app.use('/lists', router);
