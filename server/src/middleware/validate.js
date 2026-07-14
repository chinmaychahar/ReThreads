const { AppError } = require('../utils/errors');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(new AppError(400, 'Validation failed', details));
    }
    req.validatedBody = result.data;
    next();
  };
}

module.exports = { validate };
