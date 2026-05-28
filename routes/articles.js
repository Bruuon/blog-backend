const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const articleController = require('../controllers/articleController');

// Public routes
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticle);

// Protected routes
router.post('/', auth, articleController.createArticle);
router.put('/:id', auth, articleController.updateArticle);
router.delete('/:id', auth, articleController.deleteArticle);

module.exports = router;
