const User = require('../models/User');
const Repository = require('../models/Repository');
const SkillEvidence = require('../models/SkillEvidence');
const { syncUserRepositories } = require('../services/repositoryAnalysisService');
const { buildEvidenceForUser } = require('../services/evidenceEngine');
const { GithubServiceError } = require('../services/githubService');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Connects a GitHub username, pulls real repos, runs the deterministic
// evidence engine, and persists both repositories and skill evidence.
const connectGithub = asyncHandler(async (req, res) => {
  const { githubUsername } = req.body;
  if (!githubUsername || !githubUsername.trim()) {
    return fail(res, 'A GitHub username is required', 400);
  }

  let repos;
  try {
    repos = await syncUserRepositories(req.user._id, githubUsername.trim());
  } catch (err) {
    if (err instanceof GithubServiceError) {
      return fail(res, err.message, err.status);
    }
    throw err;
  }

  await User.findByIdAndUpdate(req.user._id, { githubUsername: githubUsername.trim() });

  if (repos.length === 0) {
    return ok(res, {
      repositories: [],
      message: 'No public, non-fork repositories were found for this GitHub account.',
    });
  }

  const evidenceResults = buildEvidenceForUser(repos);

  // Persist evidence, replacing any prior evidence for this user per skill.
  await Promise.all(
    evidenceResults.map((result) =>
      SkillEvidence.findOneAndUpdate(
        { userId: req.user._id, skill: result.skill },
        { ...result, userId: req.user._id },
        { upsert: true }
      )
    )
  );

  return ok(res, { repositories: repos, evidenceCount: evidenceResults.length });
});

const getStatus = asyncHandler(async (req, res) => {
  const repoCount = await Repository.countDocuments({ userId: req.user._id });
  return ok(res, {
    githubUsername: req.user.githubUsername || null,
    connected: Boolean(req.user.githubUsername),
    repositoriesAnalyzed: repoCount,
  });
});

module.exports = { connectGithub, getStatus };
