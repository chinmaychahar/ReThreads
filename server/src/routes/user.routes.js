const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const userController = require('../controllers/user.controller');

const router = Router();

router.post('/profile', authMiddleware, userController.createProfile);
router.get('/profile', authMiddleware, userController.getProfile);
router.patch('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
