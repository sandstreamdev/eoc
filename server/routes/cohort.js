const express = require('express');

const router = express.Router();

const {
  createCohort,
  getCohortById,
  getCohortsMetaData,
  updateCohortById
} = require('../controllers/cohort');
const { authorize } = require('../middleware/authorize');

router.get('/meta-data', authorize, getCohortsMetaData);
router.get('/:id', authorize, getCohortById);
router.post('/create', authorize, createCohort);
router.patch('/:id/update', authorize, updateCohortById);

module.exports = app => app.use('/cohorts', router);
