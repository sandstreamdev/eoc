const express = require('express');

const router = express.Router();
const {
  addItemToList,
  addMemberRole,
  addOwnerRole,
  addToFavourites,
  addViewer,
  changeType,
  clearVote,
  cloneItem,
  createList,
  deleteItem,
  getArchivedItems,
  getArchivedListsMetaData,
  getListData,
  getListsForItem,
  getListsMetaData,
  leaveList,
  moveItem,
  removeFromFavourites,
  removeMember,
  removeMemberRole,
  removeOwner,
  removeOwnerRole,
  updateListById,
  updateListItem,
  voteForItem
} = require('../controllers/list');
const { authorize } = require('../middleware/authorize');

router.get('/meta-data/:cohortId?', authorize, getListsMetaData);
router.get('/archived/:cohortId?', authorize, getArchivedListsMetaData);
router.post('/create', authorize, createList);
router.post('/add-item', authorize, addItemToList);
router.patch('/:id/update', authorize, updateListById);
router.get('/:id/data', authorize, getListData);
router.patch('/:id/set-vote', authorize, voteForItem);
router.patch('/:id/clear-vote', authorize, clearVote);
router.patch('/:id/add-to-fav', authorize, addToFavourites);
router.patch('/:id/remove-from-fav', authorize, removeFromFavourites);
router.patch('/:id/remove-owner', authorize, removeOwner);
router.patch('/:id/remove-member', authorize, removeMember);
router.patch('/:id/add-owner-role', authorize, addOwnerRole);
router.patch('/:id/remove-owner-role', authorize, removeOwnerRole);
router.patch('/:id/add-member-role', authorize, addMemberRole);
router.patch('/:id/remove-member-role', authorize, removeMemberRole);
router.patch('/:id/add-viewer', authorize, addViewer);
router.patch('/:id/update-item', authorize, updateListItem);
router.patch('/:id/clone-item', authorize, cloneItem);
router.patch('/:id/change-type', authorize, changeType);
router.get('/:id/archived-items', authorize, getArchivedItems);
router.delete('/:id/:itemId', authorize, deleteItem);
router.patch('/:id/leave', authorize, leaveList);
router.get('/for-item', authorize, getListsForItem);
router.patch('/:id/move-item', authorize, moveItem);

module.exports = router;
