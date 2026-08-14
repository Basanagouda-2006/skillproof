const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  createNote,
  listNotesForCandidate,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

const router = express.Router();

router.use(requireAuth, requireRole('recruiter'));
router.post('/', createNote);
router.get('/candidate/:candidateId', listNotesForCandidate);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
