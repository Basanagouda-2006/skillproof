const env = require('../config/env');

/**
 * Catches everything forwarded via next(err) or thrown in asyncHandler.
 * Never leaks stack traces or internals to the client.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[error]', err);

  let status = err.status || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
  }

  if (err.code === 11000) {
    status = 409;
    message = 'A record with this value already exists';
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier';
  }

  res.status(status).json({
    success: false,
    message: status === 500 ? 'Something went wrong on our end' : message,
    ...(env.nodeEnv === 'development' && status === 500 ? { debug: err.message } : {}),
  });
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
