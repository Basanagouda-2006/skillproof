const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  upsertShareSettings,
  getMyShareSettings,
  getPublicProfile,
} = require('../controllers/shareController');

const router = express.Router();

router.put('/settings', requireAuth, requireRole('candidate'), upsertShareSettings);
router.get('/settings', requireAuth, requireRole('candidate'), getMyShareSettings);
router.get('/public/:slug', getPublicProfile); // public, no auth

module.exports = router;
