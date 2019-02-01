const express = require('express');

const router = express.Router();

const {
  createCohort,
  getCohortById,
  getCohorts
} = require('../controllers/cohort');

router.get('/', getCohorts);
router.get('/:id', getCohortById);
router.post('/new', createCohort);

module.exports = app => app.use('/cohorts', router);
