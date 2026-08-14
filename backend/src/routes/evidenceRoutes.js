const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  listMyEvidence,
  getSkillEvidence,
  listCandidateEvidence,
} = require('../controllers/evidenceController');

const router = express.Router();

router.get('/', requireAuth, listMyEvidence);
router.get('/:skill', requireAuth, getSkillEvidence);
router.get('/candidate/:candidateId', requireAuth, requireRole('recruiter'), listCandidateEvidence);

module.exports = router;
