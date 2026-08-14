const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/token');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const SALT_ROUNDS = 12;

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return fail(res, 'An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
  });

  const token = signToken(user);

  return ok(res, { token, user: user.toSafeJSON() }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    return fail(res, 'Invalid email or password', 401);
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return fail(res, 'Invalid email or password', 401);
  }

  const token = signToken(user);

  return ok(res, { token, user: user.toSafeJSON() });
});

const me = asyncHandler(async (req, res) => {
  return ok(res, { user: req.user.toSafeJSON() });
});

// Logout is stateless (JWT) - the frontend discards the token.
// This endpoint exists for a clean, explicit client-side flow and future
// token-blacklist support if needed.
const logout = asyncHandler(async (req, res) => {
  return ok(res, { message: 'Logged out' });
});

module.exports = { register, login, me, logout };
