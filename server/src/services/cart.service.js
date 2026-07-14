const { cartRepository } = require('../repositories/cart.repository');

async function getCart(userId) {
  const cart = await cartRepository.getByUserId(userId);
  if (!cart) return { items: [] };
  return { items: JSON.parse(cart.items), docId: cart.$id };
}

async function addItem(userId, product) {
  const cart = await cartRepository.getByUserId(userId);
  let items = cart ? JSON.parse(cart.items) : [];

  const existing = items.find((i) => i.productId === product.productId);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    items.push({ ...product, quantity: product.quantity || 1 });
  }

  const itemsJson = JSON.stringify(items);
  if (cart) {
    await cartRepository.update(cart.$id, { items: itemsJson });
  } else {
    await cartRepository.create({ userId, items: itemsJson });
  }
  return { items };
}

async function removeItem(userId, productId) {
  const cart = await cartRepository.getByUserId(userId);
  if (!cart) return { items: [] };

  let items = JSON.parse(cart.items);
  items = items.filter((i) => i.productId !== productId);
  await cartRepository.update(cart.$id, { items: JSON.stringify(items) });
  return { items };
}

async function updateQuantity(userId, productId, quantity) {
  const cart = await cartRepository.getByUserId(userId);
  if (!cart) return { items: [] };

  let items = JSON.parse(cart.items);
  const item = items.find((i) => i.productId === productId);
  if (item) {
    if (quantity <= 0) {
      items = items.filter((i) => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }
  }
  await cartRepository.update(cart.$id, { items: JSON.stringify(items) });
  return { items };
}

async function clearCart(userId) {
  const cart = await cartRepository.getByUserId(userId);
  if (cart) {
    await cartRepository.update(cart.$id, { items: JSON.stringify([]) });
  }
  return { items: [] };
}

async function mergeGuestCart(userId, guestItems) {
  const cart = await cartRepository.getByUserId(userId);
  let serverItems = cart ? JSON.parse(cart.items) : [];

  for (const guestItem of guestItems) {
    const existing = serverItems.find((i) => i.productId === guestItem.productId);
    if (existing) {
      existing.quantity = Math.max(existing.quantity, guestItem.quantity || 1);
    } else {
      serverItems.push(guestItem);
    }
  }

  const itemsJson = JSON.stringify(serverItems);
  if (cart) {
    await cartRepository.update(cart.$id, { items: itemsJson });
  } else {
    await cartRepository.create({ userId, items: itemsJson });
  }
  return { items: serverItems };
}

module.exports = { getCart, addItem, removeItem, updateQuantity, clearCart, mergeGuestCart };
