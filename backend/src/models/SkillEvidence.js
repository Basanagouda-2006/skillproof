const mongoose = require('mongoose');

const evidenceItemSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g. "dependency", "language", "readme_mention", "topic", "recent_activity"
    description: { type: String, required: true },
    repositoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository' },
  },
  { _id: false }
);

const skillEvidenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skill: { type: String, required: true, trim: true },
    evidenceLevel: {
      type: String,
      enum: ['STRONG', 'MODERATE', 'WEAK', 'NO_EVIDENCE'],
      required: true,
    },
    evidenceItems: [evidenceItemSchema],
    repositoryReferences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repository' }],
    strengths: [{ type: String }],
    gaps: [{ type: String }],
    limitations: {
      type: String,
      default: 'Repository evidence demonstrates observable usage, not professional mastery.',
    },
  },
  { timestamps: true }
);

skillEvidenceSchema.index({ userId: 1, skill: 1 }, { unique: true });

module.exports = mongoose.model('SkillEvidence', skillEvidenceSchema);
