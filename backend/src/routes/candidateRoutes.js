const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { listCandidates, getCandidateProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/', requireAuth, requireRole('recruiter'), listCandidates);
router.get('/:id', requireAuth, requireRole('recruiter'), getCandidateProfile);

module.exports = router;
