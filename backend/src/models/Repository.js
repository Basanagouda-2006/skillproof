const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    githubRepositoryId: { type: Number, required: true },
    name: { type: String, required: true },
    owner: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    languages: [{ type: String }], // e.g. ["JavaScript", "TypeScript"]
    topics: [{ type: String }],
    defaultBranch: { type: String, default: 'main' },
    repoUpdatedAt: { type: Date }, // GitHub's own "updated_at"
    detectedTechnologies: [{ type: String }], // from package.json / README parsing
    isFork: { type: Boolean, default: false },
    stargazersCount: { type: Number, default: 0 },
    analyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

repositorySchema.index({ userId: 1, githubRepositoryId: 1 }, { unique: true });

module.exports = mongoose.model('Repository', repositorySchema);
