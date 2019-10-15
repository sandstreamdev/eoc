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
  confirmEmail,
  deleteAccount,
  getAccountDetails,
  getLoggedUser,
  getUserDetails,
  logout,
  recoveryPassword,
  resendSignUpConfirmationLink,
  resetPassword,
  sendUser,
  signUp,
  updateEmailReportSettings,
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
router.get('/user-details', authorize, getUserDetails);
router.post('/change-password', authorize, changePassword);
router.get('/account-details/:token?', getAccountDetails);
router.delete('', authorize, deleteAccount);
router.post('/email-reports-settings', authorize, updateEmailReportSettings);

module.exports = router;
