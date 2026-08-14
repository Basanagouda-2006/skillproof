const SkillEvidence = require('../models/SkillEvidence');
const EvidenceReport = require('../models/EvidenceReport');
const { explainEvidence, isAIAvailable } = require('../services/geminiService');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const generateReport = asyncHandler(async (req, res) => {
  const evidenceList = await SkillEvidence.find({ userId: req.user._id });

  if (evidenceList.length === 0) {
    return fail(res, 'Connect GitHub and analyze repositories before generating a report', 400);
  }

  const ai = await explainEvidence(evidenceList);

  const strongCount = evidenceList.filter((e) => e.evidenceLevel === 'STRONG').length;
  const moderateCount = evidenceList.filter((e) => e.evidenceLevel === 'MODERATE').length;
  const summary = `${strongCount} skill(s) with strong evidence, ${moderateCount} with moderate evidence, based on analyzed repositories.`;

  const report = await EvidenceReport.create({
    userId: req.user._id,
    skills: evidenceList.map((e) => ({
      skill: e.skill,
      evidenceLevel: e.evidenceLevel,
      evidenceSummary: e.strengths.join('; ') || e.gaps.join('; '),
    })),
    summary,
    aiExplanation: ai.text,
    aiAvailable: ai.available,
  });

  return ok(res, { report }, 201);
});

const listMyReports = asyncHandler(async (req, res) => {
  const reports = await EvidenceReport.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return ok(res, { reports });
});

const getReport = asyncHandler(async (req, res) => {
  const report = await EvidenceReport.findById(req.params.id);
  if (!report) return fail(res, 'Report not found', 404);
  if (report.userId.toString() !== req.user._id.toString()) {
    return fail(res, 'You do not have access to this report', 403);
  }
  return ok(res, { report });
});

module.exports = { generateReport, listMyReports, getReport };
