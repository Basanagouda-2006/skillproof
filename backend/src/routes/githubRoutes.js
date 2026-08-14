const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { connectGithub, getStatus } = require('../controllers/githubController');

const router = express.Router();

router.post('/connect', requireAuth, requireRole('candidate'), connectGithub);
router.get('/status', requireAuth, requireRole('candidate'), getStatus);

module.exports = router;
