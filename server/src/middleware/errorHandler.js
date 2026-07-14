const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    logger.error(`${err.statusCode} - ${err.message}`);
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  logger.error(`500 - ${err.message}\n${err.stack}`);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { errorHandler };
