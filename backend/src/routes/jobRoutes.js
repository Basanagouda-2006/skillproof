const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  createJob,
  listMyJobs,
  listActiveJobs,
  getJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

const router = express.Router();

router.post('/', requireAuth, requireRole('recruiter'), createJob);
router.get('/mine', requireAuth, requireRole('recruiter'), listMyJobs);
router.get('/active', listActiveJobs); // public listing for candidates
router.get('/:id', getJob);
router.put('/:id', requireAuth, requireRole('recruiter'), updateJob);
router.delete('/:id', requireAuth, requireRole('recruiter'), deleteJob);

module.exports = router;
