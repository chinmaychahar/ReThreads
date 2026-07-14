const { productRepository } = require('../repositories/product.repository');
const { logger } = require('../utils/logger');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 });

function computeSimilarity(productA, productB) {
  if (productA.$id === productB.$id) return 0;

  let score = 0;

  // Category match (0.30)
  if (productA.category === productB.category) score += 0.30;

  // Adaptive type match (0.25)
  if (productA.adaptiveType === productB.adaptiveType) score += 0.25;

  // Condition match (0.20)
  if (productA.condition === productB.condition) score += 0.20;

  // Price proximity (0.15)
  const maxPrice = Math.max(productA.price, productB.price);
  if (maxPrice > 0) {
    const priceSim = 1 - Math.abs(productA.price - productB.price) / maxPrice;
    score += priceSim * 0.15;
  }

  // Gender match (0.10)
  if (productA.gender === productB.gender || productA.gender === 'unisex' || productB.gender === 'unisex') {
    score += 0.10;
  }

  return Math.round(score * 100) / 100;
}

async function getRelated(productId, limit = 4) {
  const cacheKey = `rec_${productId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const product = await productRepository.getById(productId);
  const result = await productRepository.getByCategory(product.category, 50);
  const allProducts = result.documents;

  const scored = allProducts
    .map((p) => ({ product: p, score: computeSimilarity(product, p) }))
    .filter((s) => s.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const recommendations = scored.map((s) => s.product);
  cache.set(cacheKey, recommendations);
  return recommendations;
}

async function getPersonalized(userId, limit = 4) {
  const cacheKey = `prec_${userId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Get user's order history to understand preferences
  const { orderRepository } = require('../repositories/order.repository');
  const orders = await orderRepository.getByUserId(userId, 5);

  if (orders.documents.length === 0) {
    // No history — return featured products
    const featured = await productRepository.getFeatured(limit);
    return featured.documents;
  }

  // Extract categories and adaptive types from past orders
  const preferences = { categories: new Set(), adaptiveTypes: new Set() };
  for (const order of orders.documents) {
    const items = JSON.parse(order.items);
    for (const item of items) {
      try {
        const prod = await productRepository.getById(item.productId);
        preferences.categories.add(prod.category);
        if (prod.adaptiveType) preferences.adaptiveTypes.add(prod.adaptiveType);
      } catch (err) {
        logger.warn(`Failed to fetch product ${item.productId} for recommendations: ${err.message}`);
      }
    }
  }

  // Find products matching preferences
  const allProducts = await productRepository.list([], 50);
  const scored = allProducts.documents
    .map((p) => {
      let score = 0;
      if (preferences.categories.has(p.category)) score += 0.5;
      if (preferences.adaptiveTypes.has(p.adaptiveType)) score += 0.3;
      score += 0.2; // Base score
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const recommendations = scored.map((s) => s.product);
  cache.set(cacheKey, recommendations);
  return recommendations;
}

module.exports = { getRelated, getPersonalized, computeSimilarity };
