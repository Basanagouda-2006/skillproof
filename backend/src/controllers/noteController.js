const RecruiterNote = require('../models/RecruiterNote');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// All routes here require role=recruiter (enforced in routes file).
// Candidates have no route that can reach this controller.

const createNote = asyncHandler(async (req, res) => {
  const { candidateId, jobId, note } = req.body;
  if (!candidateId || !note) return fail(res, 'candidateId and note are required', 400);

  const doc = await RecruiterNote.create({ recruiterId: req.user._id, candidateId, jobId, note });
  return ok(res, { note: doc }, 201);
});

const listNotesForCandidate = asyncHandler(async (req, res) => {
  const notes = await RecruiterNote.find({
    recruiterId: req.user._id,
    candidateId: req.params.candidateId,
  }).sort({ createdAt: -1 });
  return ok(res, { notes });
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await RecruiterNote.findById(req.params.id);
  if (!note) return fail(res, 'Note not found', 404);
  if (note.recruiterId.toString() !== req.user._id.toString()) {
    return fail(res, 'You do not own this note', 403);
  }
  note.note = req.body.note;
  await note.save();
  return ok(res, { note });
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await RecruiterNote.findById(req.params.id);
  if (!note) return fail(res, 'Note not found', 404);
  if (note.recruiterId.toString() !== req.user._id.toString()) {
    return fail(res, 'You do not own this note', 403);
  }
  await note.deleteOne();
  return ok(res, { message: 'Note deleted' });
});

module.exports = { createNote, listNotesForCandidate, updateNote, deleteNote };
