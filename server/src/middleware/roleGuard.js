const { AppError } = require('../utils/errors');

function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }
    if (!req.userProfile || !allowedRoles.includes(req.userProfile.role)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }
    next();
  };
}

module.exports = { roleGuard };
