const express = require('express');

const router = express.Router();
const {
  authenticate,
  authenticateCallback,
  setDemoUser
} = require('../config/auth');
const { logout, sendDemoUser, sendUser } = require('../controllers/userAuth');
const {
  removeDemoUserChanges
} = require('../middleware/removeDemoUserChanges');

router.post('/demo', setDemoUser, sendDemoUser);
router.get('/google', authenticate);
router.get('/google/callback', authenticateCallback, sendUser);
router.post('/logout', removeDemoUserChanges, logout);

module.exports = router;
