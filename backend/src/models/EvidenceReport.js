const mongoose = require('mongoose');

const evidenceReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skills: [
      {
        skill: String,
        evidenceLevel: String,
        evidenceSummary: String,
      },
    ],
    summary: { type: String, default: '' },
    aiExplanation: { type: String, default: '' }, // empty if Gemini was unavailable
    aiAvailable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EvidenceReport', evidenceReportSchema);
