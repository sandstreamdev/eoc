const express = require('express');

const router = express.Router();

const {
  createCohort,
  deleteCohortById,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  updateCohortById
} = require('../controllers/cohort');
const { authorize } = require('../middleware/authorize');

router.get('/meta-data', authorize, getCohortsMetaData);
router.post('/create', authorize, createCohort);
router.get('/archived', authorize, getArchivedCohortsMetaData);
router.patch('/:id/update', authorize, updateCohortById);
router.get('/:id/data', authorize, getCohortDetails);
router.delete('/:id/delete', authorize, deleteCohortById);

module.exports = app => app.use('/cohorts', router);
