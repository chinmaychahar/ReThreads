const cartService = require('../services/cart.service');

async function getCart(req, res, next) {
  try {
    const cart = await cartService.getCart(req.user.$id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const cart = await cartService.addItem(req.user.$id, req.validatedBody);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const cart = await cartService.removeItem(req.user.$id, req.params.productId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function updateQuantity(req, res, next) {
  try {
    const cart = await cartService.updateQuantity(req.user.$id, req.params.productId, req.validatedBody.quantity);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    const cart = await cartService.clearCart(req.user.$id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function mergeCart(req, res, next) {
  try {
    const cart = await cartService.mergeGuestCart(req.user.$id, req.validatedBody.items);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, removeItem, updateQuantity, clearCart, mergeCart };
