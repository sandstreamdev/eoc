const express = require('express');

const router = express.Router();
const { authenticate, authenticateCallback } = require('../config/auth');
const { logout, setUserAndSession } = require('../controllers/userAuth');

router.get('/google', authenticate);
router.get('/google/callback', authenticateCallback, setUserAndSession);
router.post('/logout', logout);

module.exports = router;
