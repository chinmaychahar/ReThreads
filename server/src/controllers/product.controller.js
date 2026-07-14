const productService = require('../services/product.service');
const { getPagination } = require('../utils/pagination');

async function getAll(req, res, next) {
  try {
    const { limit, offset } = getPagination(req.query);
    const result = await productService.getAllProducts(limit, offset);
    res.json({ products: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function getFeatured(req, res, next) {
  try {
    const result = await productService.getFeaturedProducts();
    res.json({ products: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function getByCategory(req, res, next) {
  try {
    const { limit, offset } = getPagination(req.query);
    const result = await productService.getProductsByCategory(req.params.category, limit, offset);
    res.json({ products: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function search(req, res, next) {
  try {
    const { limit, offset } = getPagination(req.query);
    const { q, category, adaptiveType, condition, gender, minPrice, maxPrice, size, sort } = req.query;
    const result = await productService.searchProducts(
      { q, category, adaptiveType, condition, gender, minPrice, maxPrice, size, sort },
      limit,
      offset
    );
    res.json({ products: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, getFeatured, getByCategory, search };
