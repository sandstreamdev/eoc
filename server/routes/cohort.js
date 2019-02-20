const express = require('express');

const router = express.Router();

const {
  createCohort,
  getCohortById,
  getCohortDetails,
  getCohortsMetaData
} = require('../controllers/cohort');
const { authorize } = require('../middleware/authorize');

router.get('/meta-data', authorize, getCohortsMetaData);
router.get('/:id', authorize, getCohortById);
router.post('/create', authorize, createCohort);
router.get('/:id/details', authorize, getCohortDetails);

module.exports = app => app.use('/cohorts', router);
