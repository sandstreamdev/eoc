const express = require('express');

const router = express.Router();
const {
  authenticateCallback,
  authenticateWithGoogle,
  setDemoUser,
  setUser
} = require('../config/auth');
const {
  changePassword,
  checkToken,
  confirmEmail,
  getLoggedUser,
  getUserDetails,
  getUserName,
  logout,
  recoveryPassword,
  resendRecoveryLink,
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
const { authorize } = require('../middleware/authorize');

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
router.get('/recovery-password/:token?', recoveryPassword);
router.post('/update-password/:token?', updatePassword);
router.post(
  '/resend-recovery-link/:token?',
  resendRecoveryLink,
  sendResetPasswordLink
);
router.get('/user-details', authorize, getUserDetails);
router.post('/change-password', authorize, changePassword);
router.get('/user-name/:token?', getUserName);
router.get('/check-token/:token?', checkToken);

module.exports = router;
