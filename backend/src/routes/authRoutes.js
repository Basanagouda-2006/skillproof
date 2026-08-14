const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, me, logout } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidators');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Stricter limiter on auth endpoints to slow down credential-stuffing/brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

module.exports = router;
