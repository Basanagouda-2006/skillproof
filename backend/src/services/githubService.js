const axios = require('axios');
const env = require('../config/env');

const GITHUB_API = 'https://api.github.com';

function githubClient() {
  return axios.create({
    baseURL: GITHUB_API,
    timeout: 10000,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(env.githubToken ? { Authorization: `Bearer ${env.githubToken}` } : {}),
    },
  });
}

class GithubServiceError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code; // 'not_found' | 'rate_limited' | 'network' | 'unknown'
  }
}

async function fetchUserRepositories(username) {
  const client = githubClient();

  try {
    const { data } = await client.get(`/users/${encodeURIComponent(username)}/repos`, {
      params: { per_page: 100, sort: 'updated' },
    });
    return data;
  } catch (err) {
    throw mapGithubError(err, username);
  }
}

async function fetchRepoPackageJson(owner, repo, defaultBranch) {
  const client = githubClient();
  try {
    const { data } = await client.get(
      `/repos/${owner}/${repo}/contents/package.json`,
      { params: { ref: defaultBranch } }
    );
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  } catch (err) {
    // Not every repo has a package.json - that's normal, not an error.
    return null;
  }
}

async function fetchRepoReadme(owner, repo) {
  const client = githubClient();
  try {
    const { data } = await client.get(`/repos/${owner}/${repo}/readme`);
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (err) {
    return null;
  }
}

async function fetchRepoTopics(owner, repo) {
  const client = githubClient();
  try {
    const { data } = await client.get(`/repos/${owner}/${repo}/topics`);
    return data.names || [];
  } catch (err) {
    return [];
  }
}

function mapGithubError(err, username) {
  if (err.response) {
    const status = err.response.status;
    if (status === 404) {
      return new GithubServiceError(`GitHub user "${username}" was not found`, 404, 'not_found');
    }
    if (status === 403 && err.response.headers?.['x-ratelimit-remaining'] === '0') {
      return new GithubServiceError('GitHub API rate limit exceeded, try again later', 429, 'rate_limited');
    }
    return new GithubServiceError('GitHub API returned an unexpected error', status, 'unknown');
  }
  if (err.code === 'ECONNABORTED' || err.code === 'ENOTFOUND') {
    return new GithubServiceError('Could not reach GitHub, please try again', 503, 'network');
  }
  return new GithubServiceError('Unexpected error contacting GitHub', 500, 'unknown');
}

module.exports = {
  fetchUserRepositories,
  fetchRepoPackageJson,
  fetchRepoReadme,
  fetchRepoTopics,
  GithubServiceError,
};
