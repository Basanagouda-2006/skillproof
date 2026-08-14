const { SKILL_RULES, getKnownSkillNames } = require('./skillRules');

const LIMITATION_TEXT =
  'Repository evidence demonstrates observable usage, not professional mastery.';

const RECENT_ACTIVITY_WINDOW_DAYS = 180;

/**
 * Deterministic Evidence Engine.
 *
 * Input: an array of normalized Repository documents belonging to one user.
 * Output: an array of evidence objects, one per known skill, each with a
 * traceable list of evidenceItems pointing back to specific repositories.
 *
 * No AI is involved anywhere in this file. Every evidence item can be
 * traced to a concrete repository field.
 */
function buildEvidenceForUser(repositories = []) {
  const skillNames = getKnownSkillNames();
  const results = skillNames.map((skill) => evaluateSkill(skill, repositories));
  return results;
}

function evaluateSkill(skill, repositories) {
  const rule = SKILL_RULES[skill];
  const evidenceItems = [];
  const matchingRepoIds = new Set();

  for (const repo of repositories) {
    const repoEvidence = [];

    // 1. Declared dependencies (package.json, normalized at analysis time)
    const deps = repo.detectedTechnologies || [];
    for (const depName of rule.dependencyNames) {
      if (deps.some((d) => d.toLowerCase() === depName.toLowerCase())) {
        repoEvidence.push({
          type: 'dependency',
          description: `"${depName}" dependency detected in ${repo.name}`,
          repositoryId: repo._id,
        });
      }
    }

    // 2. GitHub-reported languages
    const languages = repo.languages || [];
    for (const lang of rule.languageNames) {
      if (languages.some((l) => l.toLowerCase() === lang.toLowerCase())) {
        repoEvidence.push({
          type: 'language',
          description: `${lang} detected as a repository language in ${repo.name}`,
          repositoryId: repo._id,
        });
      }
    }

    // 3. Repository topics
    const topics = repo.topics || [];
    for (const topic of rule.topicNames) {
      if (topics.some((t) => t.toLowerCase() === topic.toLowerCase())) {
        repoEvidence.push({
          type: 'topic',
          description: `Repository topic "${topic}" found on ${repo.name}`,
          repositoryId: repo._id,
        });
      }
    }

    // 4. README keyword mentions (README text is scanned, not stored verbatim)
    const readmeText = (repo._readmeTextForAnalysis || '').toLowerCase();
    for (const keyword of rule.readmeKeywords) {
      if (readmeText && readmeText.includes(keyword.toLowerCase())) {
        repoEvidence.push({
          type: 'readme_mention',
          description: `README of ${repo.name} references "${keyword}"`,
          repositoryId: repo._id,
        });
        break; // one README hit per repo is enough evidence, avoid noise
      }
    }

    // 5. Implied skills (e.g. Git is implied by having any analyzed repository)
    if (rule.impliedByAnyRepository) {
      repoEvidence.push({
        type: 'implied',
        description: `Version-controlled repository "${repo.name}" implies Git usage`,
        repositoryId: repo._id,
      });
    }

    if (repoEvidence.length > 0) {
      matchingRepoIds.add(repo._id.toString());
      evidenceItems.push(...repoEvidence);

      // 6. Recent activity bonus evidence item (does not affect matching, only level)
      if (isRecentlyUpdated(repo.repoUpdatedAt)) {
        evidenceItems.push({
          type: 'recent_activity',
          description: `${repo.name} was updated within the last ${RECENT_ACTIVITY_WINDOW_DAYS} days`,
          repositoryId: repo._id,
        });
      }
    }
  }

  const evidenceLevel = computeEvidenceLevel(matchingRepoIds.size, evidenceItems);
  const { strengths, gaps } = buildStrengthsAndGaps(skill, evidenceLevel, matchingRepoIds.size, evidenceItems);

  return {
    skill,
    evidenceLevel,
    evidenceItems,
    repositoryReferences: Array.from(matchingRepoIds),
    strengths,
    gaps,
    limitations: LIMITATION_TEXT,
  };
}

/**
 * Evidence level formula (documented, not a black box):
 *
 * NO_EVIDENCE : 0 matching repositories
 * WEAK        : 1 matching repository, and no recent-activity or README evidence
 * MODERATE    : 1 matching repository with recent activity OR README evidence,
 *               OR 2 matching repositories
 * STRONG      : 3+ matching repositories, OR 2 matching repositories with at
 *               least one recent-activity/README evidence item
 */
function computeEvidenceLevel(matchingRepoCount, evidenceItems) {
  if (matchingRepoCount === 0) return 'NO_EVIDENCE';

  const hasQualitativeSignal = evidenceItems.some(
    (e) => e.type === 'recent_activity' || e.type === 'readme_mention'
  );

  if (matchingRepoCount >= 3) return 'STRONG';
  if (matchingRepoCount === 2 && hasQualitativeSignal) return 'STRONG';
  if (matchingRepoCount === 2) return 'MODERATE';
  if (matchingRepoCount === 1 && hasQualitativeSignal) return 'MODERATE';
  return 'WEAK';
}

function isRecentlyUpdated(date) {
  if (!date) return false;
  const diffMs = Date.now() - new Date(date).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= RECENT_ACTIVITY_WINDOW_DAYS;
}

function buildStrengthsAndGaps(skill, level, matchingRepoCount, evidenceItems) {
  const strengths = [];
  const gaps = [];

  if (level === 'STRONG') {
    strengths.push(`${skill} usage confirmed across ${matchingRepoCount} repositories`);
    if (evidenceItems.some((e) => e.type === 'recent_activity')) {
      strengths.push(`Recent activity shows continued, current use of ${skill}`);
    }
  } else if (level === 'MODERATE') {
    strengths.push(`${skill} usage detected with some supporting signals`);
    gaps.push(`Additional repositories using ${skill} would strengthen this evidence`);
  } else if (level === 'WEAK') {
    gaps.push(`Only a single, limited signal for ${skill} was found`);
    gaps.push(`No README or recent-activity evidence to corroborate usage`);
  } else {
    gaps.push(`No observable evidence of ${skill} was found in analyzed repositories`);
  }

  return { strengths, gaps };
}

module.exports = { buildEvidenceForUser, evaluateSkill, computeEvidenceLevel, LIMITATION_TEXT };
