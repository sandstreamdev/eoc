const express = require('express');

const router = express.Router();
const {
  addItemDescription,
  addItemToList,
  addMember,
  addToFavourites,
  changeToMember,
  changeToOwner,
  clearVote,
  createList,
  deleteListById,
  getArchivedListsMetaData,
  getListData,
  getListsMetaData,
  removeFromFavourites,
  removeMember,
  removeOwner,
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
router.patch('/:id/set-vote', authorize, voteForItem);
router.patch('/:id/clear-vote', authorize, clearVote);
router.patch('/:id/add-to-fav', authorize, addToFavourites);
router.patch('/:id/remove-from-fav', authorize, removeFromFavourites);
router.patch('/:id/remove-owner', authorize, removeOwner);
router.patch('/:id/remove-member', authorize, removeMember);
router.patch('/:id/change-to-owner', authorize, changeToOwner);
router.patch('/:id/change-to-member', authorize, changeToMember);
router.patch('/:id/add-member', authorize, addMember);
router.patch('/:id/add-item-description', authorize, addItemDescription);

module.exports = app => app.use('/lists', router);
