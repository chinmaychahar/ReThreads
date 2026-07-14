const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authWriteLimiter } = require('../middleware/rateLimiter');
const { donationSchema } = require('../schemas/donation.schema');
const donationController = require('../controllers/donation.controller');

const router = Router();

router.use(authMiddleware);
router.use(authWriteLimiter);

router.post('/', validate(donationSchema), donationController.create);
router.get('/mine', donationController.getMyDonations);
router.get('/status/:status', donationController.getByStatus);
router.get('/:id', donationController.getStatus);

module.exports = router;
