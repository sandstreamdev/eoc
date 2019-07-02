const express = require('express');

const router = express.Router();
const {
  authenticate,
  authenticateCallback,
  setDemoUser
} = require('../config/auth');
const { signUp } = require('../controllers/userAuth');
const {
  confirmEmail,
  logout,
  resendSignUpConfirmationLink,
  sendDemoUser,
  sendUser
} = require('../controllers/userAuth');
const {
  removeDemoUserChanges
} = require('../middleware/removeDemoUserChanges');
const { sendSignUpConfirmationLink } = require('../mailer');

router.post('/demo', setDemoUser, sendDemoUser);
router.get('/google', authenticate);
router.get('/google/callback', authenticateCallback, sendUser);
router.post('/logout', removeDemoUserChanges, logout);
router.post('/sign-up', signUp, sendSignUpConfirmationLink);
router.get('/confirm-email/:hash', confirmEmail);
router.post(
  '/resend-confirmation-link',
  resendSignUpConfirmationLink,
  sendSignUpConfirmationLink
);

module.exports = router;
