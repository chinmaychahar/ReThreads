const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { addItemSchema, updateQuantitySchema, mergeCartSchema } = require('../schemas/cart.schema');
const cartController = require('../controllers/cart.controller');

const router = Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/items', validate(addItemSchema), cartController.addItem);
router.delete('/items/:productId', cartController.removeItem);
router.patch('/items/:productId', validate(updateQuantitySchema), cartController.updateQuantity);
router.delete('/', cartController.clearCart);
router.post('/merge', validate(mergeCartSchema), cartController.mergeCart);

module.exports = router;
