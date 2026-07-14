const { eventBus } = require('../eventBus');
const { logger } = require('../../utils/logger');

eventBus.on('order.created', async ({ userId, orderId }) => {
  try {
    const cartService = require('../../services/cart.service');
    await cartService.clearCart(userId);
    logger.info(`Cart cleared for user ${userId} after order ${orderId}`);
  } catch (err) {
    logger.error(`Failed to clear cart after order: ${err.message}`);
  }
});

module.exports = {};
