const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'profile', 'claimedSkills', 'isPublic'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  return ok(res, { user: user.toSafeJSON() });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return fail(res, 'New password must be at least 8 characters', 400);
  }

  const user = await User.findById(req.user._id).select('+passwordHash');
  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) return fail(res, 'Current password is incorrect', 401);

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  return ok(res, { message: 'Password updated' });
});

// Recruiter-facing candidate lookup - never exposes passwordHash.
const getCandidateProfile = asyncHandler(async (req, res) => {
  const candidate = await User.findOne({ _id: req.params.id, role: 'candidate' });
  if (!candidate) return fail(res, 'Candidate not found', 404);
  return ok(res, { candidate: candidate.toSafeJSON() });
});

const listCandidates = asyncHandler(async (req, res) => {
  const candidates = await User.find({ role: 'candidate' }).select('-passwordHash');
  return ok(res, { candidates });
});

module.exports = { updateProfile, changePassword, getCandidateProfile, listCandidates };
