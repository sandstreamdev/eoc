const express = require('express');

const router = express.Router();

const {
  createCohort,
  getCohortById,
  getCohorts
} = require('../controllers/cohort');
const { authorize } = require('../middleware/authorize');

router.get('/', authorize, getCohorts);
router.get('/:id', authorize, getCohortById);
router.post('/create', authorize, createCohort);

module.exports = app => app.use('/cohorts', router);
