const orderService = require('../services/order.service');

async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.user.$id, req.validatedBody);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    const result = await orderService.getOrders(req.user.$id);
    res.json({ orders: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.user.$id, req.params.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const order = await orderService.cancelOrder(req.user.$id, req.params.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getOrders, getOrderById, cancelOrder };
