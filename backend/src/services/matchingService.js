const SkillEvidence = require('../models/SkillEvidence');

/**
 * Deterministic candidate/job matching.
 *
 * matchScore formula (documented, never a hidden black box):
 *   Each REQUIRED skill contributes up to 2 points:
 *     STRONG = 2, MODERATE = 1.5, WEAK = 0.5, NO_EVIDENCE = 0
 *   Each PREFERRED skill contributes up to 1 point using the same scale
 *     divided by 2: STRONG = 1, MODERATE = 0.75, WEAK = 0.25, NO_EVIDENCE = 0
 *   matchScore = round( (earnedPoints / maxPossiblePoints) * 100 )
 *
 * This score is always shown alongside the skill-by-skill breakdown that
 * produced it - never as a bare, unexplained percentage.
 */
const LEVEL_WEIGHTS_REQUIRED = { STRONG: 2, MODERATE: 1.5, WEAK: 0.5, NO_EVIDENCE: 0 };
const LEVEL_WEIGHTS_PREFERRED = { STRONG: 1, MODERATE: 0.75, WEAK: 0.25, NO_EVIDENCE: 0 };

async function matchCandidateToJob(candidateId, job) {
  const evidenceDocs = await SkillEvidence.find({ userId: candidateId });
  const evidenceBySkill = new Map(evidenceDocs.map((e) => [e.skill.toLowerCase(), e]));

  const matchedSkills = [];
  const missingSkills = [];
  let earnedPoints = 0;
  let maxPoints = 0;

  for (const skill of job.requiredSkills) {
    const evidence = evidenceBySkill.get(skill.toLowerCase());
    const level = evidence ? evidence.evidenceLevel : 'NO_EVIDENCE';
    maxPoints += LEVEL_WEIGHTS_REQUIRED.STRONG;
    earnedPoints += LEVEL_WEIGHTS_REQUIRED[level] ?? 0;

    if (level === 'STRONG' || level === 'MODERATE') {
      matchedSkills.push({ skill, evidenceLevel: level });
    } else {
      missingSkills.push(skill);
    }
  }

  for (const skill of job.preferredSkills || []) {
    const evidence = evidenceBySkill.get(skill.toLowerCase());
    const level = evidence ? evidence.evidenceLevel : 'NO_EVIDENCE';
    maxPoints += LEVEL_WEIGHTS_PREFERRED.STRONG;
    earnedPoints += LEVEL_WEIGHTS_PREFERRED[level] ?? 0;

    if (level === 'STRONG' || level === 'MODERATE') {
      matchedSkills.push({ skill, evidenceLevel: level });
    }
  }

  const matchScore = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

  const evidenceSummary = `${matchedSkills.length} of ${job.requiredSkills.length} required skills have observable evidence (STRONG or MODERATE).`;

  return { matchedSkills, missingSkills, matchScore, evidenceSummary };
}

module.exports = { matchCandidateToJob };
