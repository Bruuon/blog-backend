const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const articleController = require('../controllers/articleController');

router.use(auth);
router.get('/articles', articleController.getAdminArticles);

module.exports = router;
