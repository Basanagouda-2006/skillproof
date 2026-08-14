const Job = require('../models/Job');
const CandidateJobMatch = require('../models/CandidateJobMatch');
const User = require('../models/User');
const { matchCandidateToJob } = require('../services/matchingService');
const { generateInterviewQuestions } = require('../services/geminiService');
const SkillEvidence = require('../models/SkillEvidence');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const computeMatch = asyncHandler(async (req, res) => {
  const { jobId, candidateId } = req.body;
  const job = await Job.findById(jobId);
  if (!job) return fail(res, 'Job not found', 404);
  if (job.recruiterId.toString() !== req.user._id.toString()) {
    return fail(res, 'You do not own this job posting', 403);
  }

  const candidate = await User.findById(candidateId);
  if (!candidate || candidate.role !== 'candidate') {
    return fail(res, 'Candidate not found', 404);
  }

  const { matchedSkills, missingSkills, matchScore, evidenceSummary } = await matchCandidateToJob(
    candidateId,
    job
  );

  const match = await CandidateJobMatch.findOneAndUpdate(
    { jobId, candidateId },
    { jobId, candidateId, matchedSkills, missingSkills, matchScore, evidenceSummary },
    { upsert: true, new: true }
  );

  return ok(res, { match });
});

const compareCandidates = asyncHandler(async (req, res) => {
  const { jobId, candidateIds } = req.body;
  const job = await Job.findById(jobId);
  if (!job) return fail(res, 'Job not found', 404);

  const results = [];
  for (const candidateId of candidateIds) {
    const result = await matchCandidateToJob(candidateId, job);
    const candidate = await User.findById(candidateId);
    results.push({ candidate: candidate?.toSafeJSON(), ...result });
  }

  return ok(res, { job: { title: job.title, requiredSkills: job.requiredSkills }, results });
});

const listMatchesForJob = asyncHandler(async (req, res) => {
  const matches = await CandidateJobMatch.find({ jobId: req.params.jobId }).populate(
    'candidateId',
    'name email profile'
  );
  return ok(res, { matches });
});

const updateMatchStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['new', 'reviewed', 'needs_review', 'shortlisted', 'rejected'];
  if (!allowed.includes(status)) return fail(res, 'Invalid status', 400);

  const match = await CandidateJobMatch.findById(req.params.id);
  if (!match) return fail(res, 'Match not found', 404);

  match.status = status;
  await match.save();
  return ok(res, { match });
});

// Interview Evidence Pack: strong/moderate/weak evidence breakdown +
// evidence-grounded questions for a candidate against a specific job.
const getInterviewPack = asyncHandler(async (req, res) => {
  const { jobId, candidateId } = req.params;
  const job = await Job.findById(jobId);
  if (!job) return fail(res, 'Job not found', 404);

  const evidenceList = await SkillEvidence.find({
    userId: candidateId,
    skill: { $in: [...job.requiredSkills, ...(job.preferredSkills || [])] },
  }).populate('repositoryReferences', 'name url');

  const strong = evidenceList.filter((e) => e.evidenceLevel === 'STRONG');
  const moderate = evidenceList.filter((e) => e.evidenceLevel === 'MODERATE');
  const weak = evidenceList.filter((e) => ['WEAK', 'NO_EVIDENCE'].includes(e.evidenceLevel));

  const ai = await generateInterviewQuestions(evidenceList, job.title);

  return ok(res, {
    job: { title: job.title, companyName: job.companyName },
    strongEvidence: strong,
    moderateEvidence: moderate,
    weakOrNoEvidence: weak,
    aiQuestionsAvailable: ai.available,
    questions: ai.questions,
  });
});

module.exports = {
  computeMatch,
  compareCandidates,
  listMatchesForJob,
  updateMatchStatus,
  getInterviewPack,
};
