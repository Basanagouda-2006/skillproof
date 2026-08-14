const { verifyToken } = require('../utils/token');
const { fail } = require('../utils/apiResponse');
const User = require('../models/User');

/**
 * Verifies the JWT from the Authorization header and attaches
 * the authenticated user (minus passwordHash) to req.user.
 * Never trusts a role/id claimed by the frontend outside the token.
 */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return fail(res, 'Authentication required', 401);
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return fail(res, 'User no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return fail(res, 'Invalid or expired session', 401);
  }
}

/**
 * Role-gate middleware. Use after requireAuth.
 * e.g. router.post('/jobs', requireAuth, requireRole('recruiter'), createJob)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, 'You do not have permission to perform this action', 403);
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
