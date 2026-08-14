const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  computeMatch,
  compareCandidates,
  listMatchesForJob,
  updateMatchStatus,
  getInterviewPack,
} = require('../controllers/matchController');

const router = express.Router();

router.post('/compute', requireAuth, requireRole('recruiter'), computeMatch);
router.post('/compare', requireAuth, requireRole('recruiter'), compareCandidates);
router.get('/job/:jobId', requireAuth, requireRole('recruiter'), listMatchesForJob);
router.put('/:id/status', requireAuth, requireRole('recruiter'), updateMatchStatus);
router.get(
  '/interview-pack/:jobId/:candidateId',
  requireAuth,
  requireRole('recruiter'),
  getInterviewPack
);

module.exports = router;
