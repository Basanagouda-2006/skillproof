# Evidence Engine & Matching Formulas

This document is the single source of truth referenced by the frontend UI
and the README. If the formulas below ever change, update the code in
`backend/src/services/evidenceEngine.js` and `backend/src/services/matchingService.js`
together with this file.

## Evidence level formula

For a given skill and a candidate's analyzed repositories:

- **NO_EVIDENCE** — 0 matching repositories
- **WEAK** — 1 matching repository, with no recent-activity or README evidence
- **MODERATE** — 1 matching repository with recent activity or README evidence,
  OR 2 matching repositories with no qualitative signal
- **STRONG** — 3+ matching repositories, OR 2 matching repositories where at
  least one has recent-activity or README evidence

"Matching" means the repository has at least one deterministic signal for that
skill: a declared dependency, a GitHub-reported language, a repository topic,
or (for Git specifically) simply existing as an analyzed repository.

"Recent activity" means the repository's `updated_at` timestamp from GitHub
is within the last 180 days.

## Candidate/job match score formula

Each **required** skill contributes up to 2 points:
`STRONG = 2, MODERATE = 1.5, WEAK = 0.5, NO_EVIDENCE = 0`

Each **preferred** skill contributes up to 1 point (half weight of required):
`STRONG = 1, MODERATE = 0.75, WEAK = 0.25, NO_EVIDENCE = 0`

```
matchScore = round( (earnedPoints / maxPossiblePoints) * 100 )
```

This score is never shown without the skill-by-skill breakdown that produced
it. SkillProof does not make hiring decisions — the recruiter always sees the
full breakdown and remains responsible for the decision.
