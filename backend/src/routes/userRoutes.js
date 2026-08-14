const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  updateProfile,
  changePassword,
  getCandidateProfile,
  listCandidates,
} = require('../controllers/userController');

const router = express.Router();

router.put('/me', requireAuth, updateProfile);
router.put('/me/password', requireAuth, changePassword);
router.get('/candidates', requireAuth, requireRole('recruiter'), listCandidates);
router.get('/candidates/:id', requireAuth, requireRole('recruiter'), getCandidateProfile);

module.exports = router;
