const mongoose = require('mongoose');

const recruiterNoteSchema = new mongoose.Schema(
  {
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    note: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: true }
);

// Private by design: no candidate-facing route ever queries this model.
recruiterNoteSchema.index({ recruiterId: 1, candidateId: 1 });

module.exports = mongoose.model('RecruiterNote', recruiterNoteSchema);
