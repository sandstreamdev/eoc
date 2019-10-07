const express = require('express');

const router = express.Router();

const {
  addMember,
  addOwnerRole,
  archiveCohort,
  createCohort,
  deleteCohort,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  leaveCohort,
  removeMember,
  removeOwnerRole,
  restoreCohort,
  updateCohort
} = require('../controllers/cohort');
const { authorize } = require('../middleware/authorize');

router.get('/meta-data', authorize, getCohortsMetaData);
router.post('/create', authorize, createCohort);
router.get('/archived', authorize, getArchivedCohortsMetaData);
router.patch('/:id/update', authorize, updateCohort);
router.get('/:id/data', authorize, getCohortDetails);
router.delete('/:id', authorize, deleteCohort);
router.patch('/:id/remove-member', authorize, removeMember);
router.patch('/:id/add-owner-role', authorize, addOwnerRole);
router.patch('/:id/remove-owner-role', authorize, removeOwnerRole);
router.patch('/:id/add-member', authorize, addMember);
router.patch('/:id/leave-cohort', leaveCohort);
router.patch('/:id/archive', authorize, archiveCohort);
router.patch('/:id/restore', authorize, restoreCohort);

module.exports = router;
