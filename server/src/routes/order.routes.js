const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authWriteLimiter } = require('../middleware/rateLimiter');
const { orderSchema } = require('../schemas/order.schema');
const orderController = require('../controllers/order.controller');

const router = Router();

router.use(authMiddleware);
router.use(authWriteLimiter);

router.post('/', validate(orderSchema), orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;
