const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { buyerRequestSchema } = require('../schemas/buyerRequest.schema');
const buyerRequestController = require('../controllers/buyerRequest.controller');

const router = Router();

router.use(authMiddleware);

router.post('/', validate(buyerRequestSchema), buyerRequestController.create);
router.get('/mine', buyerRequestController.getMyRequests);
router.delete('/:id', buyerRequestController.deleteRequest);

module.exports = router;
