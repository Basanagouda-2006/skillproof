/**
 * Wraps an async route handler so rejected promises are forwarded
 * to Express's error middleware instead of crashing the process
 * or leaving the request hanging.
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
