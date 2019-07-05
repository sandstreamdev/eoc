const express = require('express');

const router = express.Router();
const {
  authenticate,
  authenticateCallback,
  setDemoUser
} = require('../config/auth');
const { signUp, resetPassword } = require('../controllers/userAuth');
const {
  confirmEmail,
  logout,
  resendSignUpConfirmationLink,
  resendUpdatePassword,
  sendDemoUser,
  sendUser,
  updatePassword
} = require('../controllers/userAuth');
const {
  removeDemoUserChanges
} = require('../middleware/removeDemoUserChanges');
const {
  sendResetPasswordLink,
  sendSignUpConfirmationLink
} = require('../mailer');

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
router.post('/reset-password', resetPassword, sendResetPasswordLink);
router.post('/recovery-password/:token?', updatePassword);
router.post(
  'resend-recovery-link/:token?',
  resendUpdatePassword,
  sendResetPasswordLink
);

module.exports = router;
