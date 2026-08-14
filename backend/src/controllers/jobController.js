const Job = require('../models/Job');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const KNOWN_SKILLS = require('../services/skillRules').getKnownSkillNames();

const createJob = asyncHandler(async (req, res) => {
  const { title, companyName, description, location, employmentType, experienceLevel } = req.body;
  if (!title || !companyName || !description) {
    return fail(res, 'Title, company name, and description are required', 400);
  }

  const detected = detectSkillsFromText(description);

  const job = await Job.create({
    recruiterId: req.user._id,
    title,
    companyName,
    description,
    location,
    employmentType,
    experienceLevel,
    requiredSkills: req.body.requiredSkills?.length ? req.body.requiredSkills : detected,
    preferredSkills: req.body.preferredSkills || [],
  });

  return ok(res, { job }, 201);
});

const listMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
  return ok(res, { jobs });
});

const listActiveJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
  return ok(res, { jobs });
});

const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return fail(res, 'Job not found', 404);
  return ok(res, { job });
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return fail(res, 'Job not found', 404);
  if (job.recruiterId.toString() !== req.user._id.toString()) {
    return fail(res, 'You do not own this job posting', 403);
  }

  Object.assign(job, req.body);
  await job.save();
  return ok(res, { job });
});

const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return fail(res, 'Job not found', 404);
  if (job.recruiterId.toString() !== req.user._id.toString()) {
    return fail(res, 'You do not own this job posting', 403);
  }
  await job.deleteOne();
  return ok(res, { message: 'Job deleted' });
});

// Deterministic keyword matching against the known skill vocabulary.
// This is the source of truth; AI (if enabled) may only suggest additions,
// never silently replace this list.
function detectSkillsFromText(text) {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => lower.includes(skill.toLowerCase()));
}

module.exports = { createJob, listMyJobs, listActiveJobs, getJob, updateJob, deleteJob };
