const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const volunteerController = require('../controllers/volunteer.controller');

const router = Router();

router.use(authMiddleware);

router.post('/register', volunteerController.register);
router.get('/profile', volunteerController.getProfile);
router.get('/assignments', volunteerController.getAssignments);
router.patch('/assignments/:id', volunteerController.updateAssignment);

module.exports = router;
