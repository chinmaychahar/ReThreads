const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const recommendationController = require('../controllers/recommendation.controller');

const router = Router();

router.get('/personalized', authMiddleware, recommendationController.getPersonalized);
router.get('/:productId', recommendationController.getRelated);

module.exports = router;
