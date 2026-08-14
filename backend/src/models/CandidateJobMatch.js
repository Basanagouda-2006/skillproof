const mongoose = require('mongoose');

const skillMatchSchema = new mongoose.Schema(
  {
    skill: String,
    evidenceLevel: String, // STRONG | MODERATE | WEAK | NO_EVIDENCE
  },
  { _id: false }
);

const candidateJobMatchSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    matchedSkills: [skillMatchSchema], // required/preferred skills with STRONG or MODERATE evidence
    missingSkills: [{ type: String }], // required skills with WEAK or NO_EVIDENCE
    evidenceSummary: { type: String, default: '' },
    matchScore: { type: Number, default: 0 }, // see docs/evidence-engine.md for exact formula
    status: {
      type: String,
      enum: ['new', 'reviewed', 'needs_review', 'shortlisted', 'rejected'],
      default: 'new',
    },
  },
  { timestamps: true }
);

candidateJobMatchSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('CandidateJobMatch', candidateJobMatchSchema);
