const express = require('express');

const router = express.Router();

const {
  addMember,
  addToFavourites,
  changeToMember,
  changeToOwner,
  createCohort,
  deleteCohortById,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  removeFromFavourites,
  removeMember,
  removeOwner,
  updateCohortById
} = require('../controllers/cohort');
const { authorize } = require('../middleware/authorize');

router.get('/meta-data', authorize, getCohortsMetaData);
router.post('/create', authorize, createCohort);
router.get('/archived', authorize, getArchivedCohortsMetaData);
router.patch('/:id/update', authorize, updateCohortById);
router.get('/:id/data', authorize, getCohortDetails);
router.delete('/:id/delete', authorize, deleteCohortById);
router.patch('/:id/add-to-fav', authorize, addToFavourites);
router.patch('/:id/remove-from-fav', authorize, removeFromFavourites);
router.patch('/:id/remove-owner', authorize, removeOwner);
router.patch('/:id/remove-member', authorize, removeMember);
router.patch('/:id/change-to-owner', authorize, changeToOwner);
router.patch('/:id/change-to-member', authorize, changeToMember);
router.patch('/:id/add-member', authorize, addMember);

module.exports = app => app.use('/cohorts', router);
