const { buyerRequestRepository } = require('../repositories/buyerRequest.repository');
const { productRepository } = require('../repositories/product.repository');
const { logger } = require('../utils/logger');

const COMPATIBLE_TYPES = {
  magnetic_closure: ['velcro'],
  velcro: ['magnetic_closure'],
  side_zip: ['open_back'],
  open_back: ['side_zip'],
  elastic_waist: ['pull_on'],
  pull_on: ['elastic_waist'],
  front_flap: ['open_back'],
};

const RELATED_CONDITIONS = {
  alzheimers: ['elderly'],
  elderly: ['alzheimers', 'parkinsons'],
  parkinsons: ['elderly', 'cerebral_palsy'],
  cerebral_palsy: ['parkinsons'],
};

const ADJACENT_SIZES = {
  XS: ['S'],
  S: ['XS', 'M'],
  M: ['S', 'L'],
  L: ['M', 'XL'],
  XL: ['L', 'XXL'],
  XXL: ['XL'],
};

function scoreMatch(product, request) {
  let score = 0;

  // Category (25 pts)
  if (product.category === request.category) {
    score += 25;
  } else if (RELATED_CONDITIONS[request.category]?.includes(product.category)) {
    score += 15;
  }

  // Adaptive type (25 pts)
  if (request.adaptiveType) {
    if (product.adaptiveType === request.adaptiveType) {
      score += 25;
    } else if (COMPATIBLE_TYPES[request.adaptiveType]?.includes(product.adaptiveType)) {
      score += 15;
    }
  }

  // Medical condition (20 pts)
  if (request.medicalCondition) {
    if (product.category === request.medicalCondition) {
      score += 20;
    } else if (RELATED_CONDITIONS[request.medicalCondition]?.includes(product.category)) {
      score += 10;
    }
  } else {
    score += 10; // No condition specified = partial match
  }

  // Size (15 pts)
  if (request.size) {
    const productSizes = JSON.parse(product.sizes || '[]');
    if (productSizes.includes(request.size)) {
      score += 15;
    } else if (productSizes.some((s) => ADJACENT_SIZES[request.size]?.includes(s))) {
      score += 8;
    }
  }

  // Urgency boost (10 pts)
  const urgencyPoints = { high: 10, medium: 5, low: 0 };
  score += urgencyPoints[request.urgency] || 0;

  // Price fit (5 pts)
  if (request.maxBudget && product.price <= request.maxBudget) {
    score += 5;
  } else if (!request.maxBudget) {
    score += 5; // No budget constraint = full points
  }

  return score;
}

async function matchProductToRequests(product) {
  const result = await buyerRequestRepository.getOpenByCategory(product.category);
  const requests = result.documents;

  const matches = requests
    .map((req) => ({ request: req, score: scoreMatch(product, req) }))
    .filter((m) => m.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  for (const match of matches) {
    const existing = JSON.parse(match.request.matchedProducts || '[]');
    existing.push({ productId: product.$id, score: match.score, title: product.title });
    await buyerRequestRepository.update(match.request.$id, {
      matchedProducts: JSON.stringify(existing),
    });
    logger.info(`Matched product "${product.title}" to request ${match.request.$id} (score: ${match.score})`);
  }

  return matches;
}

async function matchRequestToProducts(request) {
  const result = await productRepository.getByCategory(request.category, 50);
  const products = result.documents;

  const matches = products
    .map((prod) => ({ product: prod, score: scoreMatch(prod, request) }))
    .filter((m) => m.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (matches.length > 0) {
    const matchedProducts = matches.map((m) => ({
      productId: m.product.$id,
      score: m.score,
      title: m.product.title,
    }));
    await buyerRequestRepository.update(request.$id, {
      matchedProducts: JSON.stringify(matchedProducts),
    });
  }

  return matches;
}

module.exports = { scoreMatch, matchProductToRequests, matchRequestToProducts };
