const express = require('express');

const { authorize } = require('../middleware/authorize');
const { getLibraries, getLicense } = require('../controllers/library');

const router = express.Router();

router.get('/names', authorize, getLibraries);
router.get('/:library', authorize, getLicense);

module.exports = router;
