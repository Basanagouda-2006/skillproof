const SkillEvidence = require('../models/SkillEvidence');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listMyEvidence = asyncHandler(async (req, res) => {
  const evidence = await SkillEvidence.find({ userId: req.user._id })
    .populate('repositoryReferences', 'name url owner')
    .sort({ evidenceLevel: 1, skill: 1 });
  return ok(res, { evidence });
});

const getSkillEvidence = asyncHandler(async (req, res) => {
  const evidence = await SkillEvidence.findOne({
    userId: req.params.userId || req.user._id,
    skill: req.params.skill,
  }).populate('repositoryReferences', 'name url owner description');

  if (!evidence) return fail(res, 'No evidence found for this skill', 404);
  return ok(res, { evidence });
});

// Recruiters viewing a candidate's evidence (read-only, no ownership required
// beyond being an authenticated recruiter).
const listCandidateEvidence = asyncHandler(async (req, res) => {
  const evidence = await SkillEvidence.find({ userId: req.params.candidateId })
    .populate('repositoryReferences', 'name url owner');
  return ok(res, { evidence });
});

module.exports = { listMyEvidence, getSkillEvidence, listCandidateEvidence };
