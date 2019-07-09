const express = require('express');

const router = express.Router();
const {
  authenticateCallback,
  authenticateWithGoogle,
  setDemoUser,
  setUser
} = require('../config/auth');
const {
  confirmEmail,
  getLoggedUser,
  logout,
  resendSignUpConfirmationLink,
  resetPassword,
  sendUser,
  signUp,
  updatePassword
} = require('../controllers/userAuth');
const {
  removeDemoUserChanges
} = require('../middleware/removeDemoUserChanges');
const {
  sendResetPasswordLink,
  sendSignUpConfirmationLink
} = require('../mailer');

router.post('/demo', setDemoUser, sendUser);
router.get('/google', authenticateWithGoogle);
router.get('/google/callback', authenticateCallback);
router.post('/logout', removeDemoUserChanges, logout);
router.post('/sign-up', signUp, sendSignUpConfirmationLink);
router.get('/confirm-email/:hash', confirmEmail);
router.post('/sign-in', setUser, sendUser);
router.post(
  '/resend-confirmation-link',
  resendSignUpConfirmationLink,
  sendSignUpConfirmationLink
);
router.get('/user', getLoggedUser);
router.post('/reset-password', resetPassword, sendResetPasswordLink);
router.post('/recovery-password/:token?', updatePassword);
module.exports = router;
