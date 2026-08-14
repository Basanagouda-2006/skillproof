const slugify = require('slugify');
const crypto = require('crypto');
const ShareableProfile = require('../models/ShareableProfile');
const User = require('../models/User');
const SkillEvidence = require('../models/SkillEvidence');
const Repository = require('../models/Repository');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const upsertShareSettings = asyncHandler(async (req, res) => {
  const { enabled, selectedSkills, selectedRepositories } = req.body;

  let profile = await ShareableProfile.findOne({ candidateId: req.user._id });

  if (!profile) {
    const baseSlug = slugify(req.user.name, { lower: true, strict: true });
    const uniqueSuffix = crypto.randomBytes(3).toString('hex');
    profile = await ShareableProfile.create({
      candidateId: req.user._id,
      slug: `${baseSlug}-${uniqueSuffix}`,
      enabled: Boolean(enabled),
      selectedSkills: selectedSkills || [],
      selectedRepositories: selectedRepositories || [],
    });
  } else {
    profile.enabled = enabled ?? profile.enabled;
    profile.selectedSkills = selectedSkills ?? profile.selectedSkills;
    profile.selectedRepositories = selectedRepositories ?? profile.selectedRepositories;
    await profile.save();
  }

  return ok(res, { profile });
});

const getMyShareSettings = asyncHandler(async (req, res) => {
  const profile = await ShareableProfile.findOne({ candidateId: req.user._id });
  return ok(res, { profile: profile || null });
});

// Public endpoint - no auth. Only returns data the candidate explicitly
// selected, and only if sharing is enabled.
const getPublicProfile = asyncHandler(async (req, res) => {
  const profile = await ShareableProfile.findOne({ slug: req.params.slug, enabled: true });
  if (!profile) return fail(res, 'This profile is not available', 404);

  const candidate = await User.findById(profile.candidateId);
  const evidence = await SkillEvidence.find({
    userId: profile.candidateId,
    skill: { $in: profile.selectedSkills },
  });
  const repositories = await Repository.find({ _id: { $in: profile.selectedRepositories } });

  return ok(res, {
    profile: {
      name: candidate.name,
      bio: candidate.profile.bio,
      linkedin: candidate.profile.linkedin,
      portfolio: candidate.profile.portfolio,
      githubUsername: candidate.githubUsername,
      evidence,
      repositories,
    },
  });
});

module.exports = { upsertShareSettings, getMyShareSettings, getPublicProfile };
