const { productRepository } = require('../repositories/product.repository');
const { AppError } = require('../utils/errors');

async function getAllProducts(limit, offset) {
  return productRepository.list([], limit, offset);
}

async function getProductById(id) {
  const product = await productRepository.getById(id);
  return product;
}

async function getFeaturedProducts() {
  return productRepository.getFeatured(8);
}

async function getProductsByCategory(category, limit, offset) {
  const validCategories = ['general', 'alzheimers', 'parkinsons', 'cerebral_palsy', 'elderly'];
  if (!validCategories.includes(category)) {
    throw new AppError(400, `Invalid category. Valid: ${validCategories.join(', ')}`);
  }
  return productRepository.getByCategory(category, limit, offset);
}

async function searchProducts(filters, limit, offset) {
  return productRepository.search(filters, limit, offset);
}

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
};
