const recommendationService = require('../services/recommendation.service');

async function getRelated(req, res, next) {
  try {
    const products = await recommendationService.getRelated(req.params.productId);
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

async function getPersonalized(req, res, next) {
  try {
    const products = await recommendationService.getPersonalized(req.user.$id);
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRelated, getPersonalized };
