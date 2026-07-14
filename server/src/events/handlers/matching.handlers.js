const { eventBus } = require('../eventBus');
const { logger } = require('../../utils/logger');

eventBus.on('product.created.from.donation', async ({ product, donationId }) => {
  try {
    const { matchProductToRequests } = require('../../services/matching.service');

    // Product already exists — no need to query for it
    const matches = await matchProductToRequests(product);
    logger.info(`Found ${matches.length} buyer request matches for product from donation ${donationId}`);
  } catch (err) {
    logger.error(`Failed to match product from donation ${donationId}: ${err.message}`);
  }
});

eventBus.on('request.created', async ({ requestId, request }) => {
  try {
    const { matchRequestToProducts } = require('../../services/matching.service');
    const matches = await matchRequestToProducts(request);
    logger.info(`Found ${matches.length} product matches for new request ${requestId}`);
  } catch (err) {
    logger.error(`Failed to match request ${requestId}: ${err.message}`);
  }
});

module.exports = {};
