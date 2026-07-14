const { orderRepository } = require('../repositories/order.repository');
const { productRepository } = require('../repositories/product.repository');
const cartService = require('./cart.service');
const { eventBus } = require('../events/eventBus');
const { AppError } = require('../utils/errors');
const { logger } = require('../utils/logger');

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RT-${timestamp}-${random}`;
}

async function reserveStockWithRetry(item, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const product = await productRepository.getById(item.productId);
    if (product.stock < item.quantity) {
      throw new AppError(400, `"${product.title}" is out of stock (available: ${product.stock})`);
    }
    const newStock = product.stock - item.quantity;
    await productRepository.update(item.productId, { stock: newStock });

    // Verify the update was applied correctly (detect concurrent modification)
    const updated = await productRepository.getById(item.productId);
    if (updated.stock === newStock) {
      return { productId: item.productId, quantity: item.quantity, previousStock: product.stock, price: product.price };
    }
    // Someone else modified — retry
    logger.warn(`Stock reservation conflict for product ${item.productId}, attempt ${attempt + 1}/${maxRetries}`);
    if (attempt === maxRetries - 1) {
      throw new AppError(409, 'Stock reservation conflict. Please try again.');
    }
  }
}

async function createOrder(userId, orderData) {
  const cart = await cartService.getCart(userId);
  if (!cart.items || cart.items.length === 0) {
    throw new AppError(400, 'Cart is empty');
  }

  // Validate stock and fetch real prices from DB (prevents price manipulation)
  for (const item of cart.items) {
    try {
      const product = await productRepository.getById(item.productId);
      if (product.stock < item.quantity) {
        throw new AppError(400, `"${product.title}" is out of stock (available: ${product.stock})`);
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(400, `Product ${item.productId} not found`);
    }
  }

  // Reserve stock with optimistic concurrency (retry on conflict)
  const stockUpdates = [];
  try {
    for (const item of cart.items) {
      const result = await reserveStockWithRetry(item);
      stockUpdates.push(result);
    }
  } catch (err) {
    // Rollback stock on failure
    for (const update of stockUpdates) {
      try {
        await productRepository.update(update.productId, { stock: update.previousStock });
      } catch (rollbackErr) {
        logger.error(`Failed to rollback stock for product ${update.productId}: ${rollbackErr.message}`);
      }
    }
    if (err instanceof AppError) throw err;
    throw new AppError(500, 'Failed to reserve stock. Please try again.');
  }

  // Calculate totals from verified DB prices (not client-provided prices)
  const subtotal = stockUpdates.reduce((sum, u) => {
    const cartItem = cart.items.find((i) => i.productId === u.productId);
    return sum + u.price * cartItem.quantity;
  }, 0);
  const gst = Math.round(subtotal * 0.18 * 100) / 100;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = Math.round((subtotal + gst + shipping) * 100) / 100;

  // Build items with verified prices for storage
  const verifiedItems = cart.items.map((item) => {
    const stockUpdate = stockUpdates.find((u) => u.productId === item.productId);
    return { ...item, price: stockUpdate.price };
  });

  // Create order document
  const orderNumber = generateOrderNumber();
  const statusHistory = JSON.stringify([{ status: 'confirmed', timestamp: new Date().toISOString() }]);

  const order = await orderRepository.create({
    userId,
    orderNumber,
    items: JSON.stringify(verifiedItems),
    subtotal,
    gst,
    shipping,
    total,
    status: 'confirmed',
    statusHistory,
    shippingAddress: JSON.stringify(orderData.shippingAddress),
    paymentMethod: orderData.paymentMethod,
  });

  // Emit event (async side-effects)
  eventBus.emit('order.created', { userId, orderId: order.$id, orderNumber });

  return order;
}

async function getOrders(userId) {
  return orderRepository.getByUserId(userId);
}

async function getOrderById(userId, orderId) {
  const order = await orderRepository.getById(orderId);
  if (order.userId !== userId) {
    throw new AppError(403, 'Not authorized to view this order');
  }
  return order;
}

async function cancelOrder(userId, orderId) {
  const order = await orderRepository.getById(orderId);
  if (order.userId !== userId) {
    throw new AppError(403, 'Not authorized');
  }
  if (order.status !== 'confirmed') {
    throw new AppError(400, 'Only confirmed orders can be cancelled');
  }

  // Restore stock
  const items = JSON.parse(order.items);
  for (const item of items) {
    try {
      const product = await productRepository.getById(item.productId);
      await productRepository.update(item.productId, { stock: product.stock + item.quantity });
    } catch (err) {
      // Continue even if product was deleted
    }
  }

  const history = JSON.parse(order.statusHistory || '[]');
  history.push({ status: 'cancelled', timestamp: new Date().toISOString() });

  return orderRepository.update(orderId, {
    status: 'cancelled',
    statusHistory: JSON.stringify(history),
  });
}

module.exports = { createOrder, getOrders, getOrderById, cancelOrder };
