const express = require('express');

const router = express.Router();

const { authorize } = require('../middleware/authorize');
const { sendInvitation } = require('../mailer');

router.post('/send-invitation', authorize, sendInvitation);

module.exports = router;
