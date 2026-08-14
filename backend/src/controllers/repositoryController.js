const Repository = require('../models/Repository');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listMyRepositories = asyncHandler(async (req, res) => {
  const repos = await Repository.find({ userId: req.user._id }).sort({ repoUpdatedAt: -1 });
  return ok(res, { repositories: repos });
});

const getRepository = asyncHandler(async (req, res) => {
  const repo = await Repository.findById(req.params.id);
  if (!repo) return fail(res, 'Repository not found', 404);
  if (repo.userId.toString() !== req.user._id.toString() && req.user.role !== 'recruiter') {
    return fail(res, 'You do not have access to this repository', 403);
  }
  return ok(res, { repository: repo });
});

module.exports = { listMyRepositories, getRepository };
