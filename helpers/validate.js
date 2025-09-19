const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    
    const formattedErrors = errors.array().map(err => ({
      field: err.path,       
      message: err.msg       
    }));

    return res.status(400).json({
      status: 'fail',
      errors: formattedErrors
    });
  }
  next();
};

module.exports = { validateRequest };
