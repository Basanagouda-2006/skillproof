/**
 * Deterministic skill-detection rules.
 *
 * Each rule tells the evidence engine which OBSERVABLE signals count as
 * evidence for a given skill. Nothing here is inferred by AI - it is plain
 * string/dependency matching against real repository data.
 *
 * dependencyNames: keys to look for in package.json dependencies/devDependencies
 * languageNames: GitHub-reported repository languages
 * topicNames: GitHub repository topics
 * readmeKeywords: case-insensitive substrings to look for in README text
 */
const SKILL_RULES = {
  React: {
    dependencyNames: ['react', 'react-dom'],
    languageNames: [],
    topicNames: ['react', 'reactjs'],
    readmeKeywords: ['react'],
  },
  TypeScript: {
    dependencyNames: ['typescript'],
    languageNames: ['TypeScript'],
    topicNames: ['typescript'],
    readmeKeywords: ['typescript'],
  },
  'Node.js': {
    dependencyNames: ['express', 'fastify', 'koa'],
    languageNames: ['JavaScript', 'TypeScript'],
    topicNames: ['nodejs', 'node'],
    readmeKeywords: ['node.js', 'nodejs'],
  },
  'REST API': {
    dependencyNames: ['express', 'fastify', 'koa', 'axios'],
    languageNames: [],
    topicNames: ['rest-api', 'api'],
    readmeKeywords: ['rest api', 'restful'],
  },
  MongoDB: {
    dependencyNames: ['mongoose', 'mongodb'],
    languageNames: [],
    topicNames: ['mongodb'],
    readmeKeywords: ['mongodb', 'mongoose'],
  },
  SQL: {
    dependencyNames: ['pg', 'mysql', 'mysql2', 'sequelize', 'typeorm', 'sqlite3', 'knex'],
    languageNames: ['PLpgSQL', 'SQL'],
    topicNames: ['sql', 'postgresql', 'mysql'],
    readmeKeywords: ['sql', 'postgresql', 'mysql'],
  },
  Git: {
    // Presence of any analyzed repository already proves Git usage;
    // the engine adds this evidence item directly rather than via rules.
    dependencyNames: [],
    languageNames: [],
    topicNames: [],
    readmeKeywords: [],
    impliedByAnyRepository: true,
  },
  Testing: {
    dependencyNames: ['jest', 'mocha', 'chai', 'vitest', 'cypress', 'playwright', '@testing-library/react'],
    languageNames: [],
    topicNames: ['testing', 'unit-testing'],
    readmeKeywords: ['unit test', 'test suite', 'jest', 'cypress'],
  },
  Python: {
    dependencyNames: [],
    languageNames: ['Python'],
    topicNames: ['python'],
    readmeKeywords: ['python'],
  },
  Docker: {
    dependencyNames: [],
    languageNames: ['Dockerfile'],
    topicNames: ['docker'],
    readmeKeywords: ['dockerfile', 'docker-compose', 'docker build'],
  },
  'Tailwind CSS': {
    dependencyNames: ['tailwindcss'],
    languageNames: [],
    topicNames: ['tailwindcss', 'tailwind'],
    readmeKeywords: ['tailwind'],
  },
  GraphQL: {
    dependencyNames: ['graphql', 'apollo-server', '@apollo/client'],
    languageNames: ['GraphQL'],
    topicNames: ['graphql'],
    readmeKeywords: ['graphql'],
  },
  'Next.js': {
    dependencyNames: ['next'],
    languageNames: [],
    topicNames: ['nextjs'],
    readmeKeywords: ['next.js', 'nextjs'],
  },
  Java: {
    dependencyNames: [],
    languageNames: ['Java'],
    topicNames: ['java'],
    readmeKeywords: ['java'],
  },
};

function getKnownSkillNames() {
  return Object.keys(SKILL_RULES);
}

module.exports = { SKILL_RULES, getKnownSkillNames };
