const express = require('express');

const { addComment } = require('../controllers/comment');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.patch('/:id/add-comment', authorize, addComment);

module.exports = app => app.use('/comments', router);
