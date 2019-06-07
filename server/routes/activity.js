const express = require('express');

const router = express.Router();

const { authorize } = require('../middleware/authorize');
const { getActivities } = require('../controllers/activity');

router.get('/data', authorize, getActivities);

module.exports = router;
