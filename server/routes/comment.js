const express = require('express');

const { authorize } = require('../middleware/authorize');
const { addComment, getComments } = require('../controllers/comment');

const router = express.Router();

router.post('/add-comment', authorize, addComment);
router.get('/:listId/:itemId/data', authorize, getComments);

module.exports = router;
