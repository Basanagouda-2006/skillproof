const mongoose = require('mongoose');

const shareableProfileSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: false },
    selectedSkills: [{ type: String }],
    selectedRepositories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repository' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShareableProfile', shareableProfileSchema);
