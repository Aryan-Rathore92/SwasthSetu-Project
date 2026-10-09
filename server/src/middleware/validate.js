export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      const issues = err.errors ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') : err.message;
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${issues}`,
        code: 'VALIDATION_ERROR',
        details: err.errors || [],
      });
    }
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed;
      next();
    } catch (err) {
      const issues = err.errors ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') : err.message;
      return res.status(400).json({
        success: false,
        message: `Invalid query parameters: ${issues}`,
        code: 'QUERY_VALIDATION_ERROR',
        details: err.errors || [],
      });
    }
  };
};

