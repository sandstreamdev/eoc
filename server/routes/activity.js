const express = require('express');

const { authorize } = require('../middleware/authorize');
const { getActivities } = require('../controllers/activity');

const router = express.Router();

router.post('/activities', authorize, getActivities);

module.exports = router;
