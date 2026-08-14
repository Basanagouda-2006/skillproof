const Repository = require('../models/Repository');
const {
  fetchUserRepositories,
  fetchRepoPackageJson,
  fetchRepoReadme,
  fetchRepoTopics,
} = require('./githubService');

const MAX_REPOS_TO_DEEP_ANALYZE = 30; // avoid excessive GitHub API calls per sync

/**
 * Fetches a candidate's real GitHub repositories, normalizes them, extracts
 * detected technologies from package.json (when present), and upserts them
 * into MongoDB. Never invents a repository that GitHub did not return.
 */
async function syncUserRepositories(userId, githubUsername) {
  const rawRepos = await fetchUserRepositories(githubUsername);

  const nonForkRepos = rawRepos.filter((r) => !r.fork).slice(0, MAX_REPOS_TO_DEEP_ANALYZE);

  const savedRepos = [];

  for (const raw of nonForkRepos) {
    const [topics, packageJson, readmeText] = await Promise.all([
      fetchRepoTopics(raw.owner.login, raw.name),
      fetchRepoPackageJson(raw.owner.login, raw.name, raw.default_branch),
      fetchRepoReadme(raw.owner.login, raw.name),
    ]);

    const detectedTechnologies = extractTechnologiesFromPackageJson(packageJson);

    const doc = await Repository.findOneAndUpdate(
      { userId, githubRepositoryId: raw.id },
      {
        userId,
        githubRepositoryId: raw.id,
        name: raw.name,
        owner: raw.owner.login,
        url: raw.html_url,
        description: raw.description || '',
        languages: raw.language ? [raw.language] : [],
        topics,
        defaultBranch: raw.default_branch,
        repoUpdatedAt: raw.updated_at,
        detectedTechnologies,
        isFork: raw.fork,
        stargazersCount: raw.stargazers_count || 0,
        analyzedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Attach README text transiently for the evidence engine's current pass.
    // This is NOT persisted to avoid storing large raw text in MongoDB.
    doc._readmeTextForAnalysis = readmeText || '';

    savedRepos.push(doc);
  }

  return savedRepos;
}

function extractTechnologiesFromPackageJson(pkg) {
  if (!pkg) return [];
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  return Object.keys(deps);
}

module.exports = { syncUserRepositories };
