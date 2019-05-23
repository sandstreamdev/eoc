const express = require('express');

const router = express.Router();

const { authorize } = require('../middleware/authorize');
const { sendInvitation } = require('../mailer');

router.patch('/send-invitation', authorize, sendInvitation);

module.exports = router;
