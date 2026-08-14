# SkillProof

**Turn technical claims into verifiable evidence.**

SkillProof is a full-stack web application for evidence-based technical
skill verification. Candidates connect real GitHub activity and get
traceable, explainable evidence for their claimed skills. Recruiters
evaluate candidates against job requirements using that evidence instead
of relying on resumes and claims alone.

## Core principle: deterministic evidence first, AI second

```
Real GitHub data → Normalization → Deterministic evidence engine
   → Evidence result → Optional AI explanation → Reports / matching / interview prep
```

- The evidence engine (`backend/src/services/evidenceEngine.js`) is pure,
  deterministic, rule-based logic. It never calls an AI model.
- AI (Gemini) is used **only** to explain evidence that has already been
  verified, generate evidence-grounded interview questions, and summarize
  gaps. It cannot invent repositories, technologies, activity, or scores.
- If the Gemini API key is missing or the API call fails, the entire
  application continues to work — the UI clearly shows "AI unavailable"
  and falls back to the deterministic evidence alone.

See [`docs/evidence-engine.md`](docs/evidence-engine.md) for the exact,
documented evidence-level and match-score formulas.

## Features

- Real GitHub repository analysis (languages, dependencies, topics, README)
- Deterministic evidence engine with 4 evidence levels: STRONG, MODERATE, WEAK, NO_EVIDENCE
- Every evidence item is traceable to a specific repository and signal
- Evidence reports with history, optionally explained by Gemini
- Job postings with deterministic requirement detection
- Candidate/job matching with a documented, transparent scoring formula
- Side-by-side candidate comparison for recruiters
- Evidence-grounded "Interview Evidence Pack" with AI-assisted questions
- Private recruiter notes, never visible to candidates
- Opt-in shareable public candidate profiles with selective visibility
- Full JWT authentication with bcrypt password hashing and role-based
  authorization enforced on the backend

## Tech stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router, Axios, Lucide React, Recharts
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
**External APIs:** GitHub REST API, Gemini API (optional)

## Project structure

```
skillproof/
├── backend/
│   └── src/
│       ├── config/       # env + MongoDB connection
│       ├── controllers/  # request handlers
│       ├── middleware/   # auth, error handling, validation
│       ├── models/       # Mongoose schemas
│       ├── routes/       # Express routers
│       ├── services/     # evidence engine, GitHub, Gemini, matching
│       ├── validators/   # express-validator rules
│       └── utils/        # token, response, async helpers
├── frontend/
│   └── src/
│       ├── components/   # shared UI (evidence badges, evidence trace, layout)
│       ├── context/      # AuthContext
│       ├── layouts/      # public/candidate/recruiter shells
│       ├── pages/        # public, auth, candidate, recruiter pages
│       ├── services/     # API client
│       └── types/        # shared TypeScript types
└── docs/
    └── evidence-engine.md
```

## Database models

`User`, `Repository`, `SkillEvidence`, `EvidenceReport`, `Job`,
`CandidateJobMatch`, `RecruiterNote`, `ShareableProfile` — see each file
in `backend/src/models/` for the full schema.

## API overview

All responses use a consistent envelope:

```json
{ "success": true, "data": {} }
{ "success": false, "message": "Meaningful error" }
```

| Base path            | Purpose                                   |
|-----------------------|--------------------------------------------|
| `/api/auth`           | register, login, me, logout               |
| `/api/users`          | profile updates, password change          |
| `/api/github`         | connect GitHub, analysis status           |
| `/api/repositories`   | list/view analyzed repositories           |
| `/api/evidence`       | list/view skill evidence                  |
| `/api/reports`        | generate/list/view evidence reports       |
| `/api/jobs`           | job CRUD, active job listing              |
| `/api/matches`        | compute/compare matches, interview packs  |
| `/api/candidates`     | recruiter-facing candidate lookup         |
| `/api/notes`          | private recruiter notes                   |
| `/api/share`          | shareable profile settings + public view  |
| `/api/health`         | real backend/DB status                    |

## Authentication & security

- Passwords hashed with bcrypt (12 salt rounds); hashes are never returned
- JWT-based sessions, verified on every protected request
- Role-based authorization (`candidate` / `recruiter`) enforced server-side
- Ownership checks on every mutating request (a recruiter can only edit
  their own jobs/notes; a candidate can only edit their own profile)
- Rate limiting on auth endpoints and the general API
- `helmet` for standard security headers, CORS restricted to the configured client URL
- Secrets (`MONGO_URI`, `JWT_SECRET`, `GITHUB_TOKEN`, `GEMINI_API_KEY`) live
  only in backend environment variables and are never sent to the frontend

## Environment variables

**`backend/.env`** (copy from `backend/.env.example`):

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/skillproof
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
GITHUB_TOKEN=            # optional but recommended (higher GitHub API rate limit)
GEMINI_API_KEY=          # optional — app works fully without it
CLIENT_URL=http://localhost:5173
```

**`frontend/.env`** (copy from `frontend/.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

## Local development

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET at minimum
npm run dev             # starts on http://localhost:5000

# Frontend (in a separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev              # starts on http://localhost:5173
```

Visit `http://localhost:5173`, register as a candidate, connect a real
GitHub username under **GitHub** in the sidebar, and evidence will be
generated automatically from your public repositories.

## Deployment

- **Frontend** → Vercel or Netlify (build command `npm run build`, output `dist/`)
- **Backend** → Render (start command `npm start`)
- **Database** → MongoDB Atlas

Set the same environment variables from `.env.example` in each platform's
dashboard. Update `CLIENT_URL` on the backend and `VITE_API_URL` on the
frontend to your deployed URLs.

## Known limitations

- Evidence is based only on observable, public repository signals (languages,
  dependencies, topics, README mentions, activity recency) — it does not and
  cannot measure code quality, correctness, or professional mastery.
- Private repositories are not analyzed unless a GitHub token with the
  appropriate scope is configured, and even then the current implementation
  only fetches public repositories via the standard `/users/:username/repos`
  endpoint.
- The skill vocabulary (`backend/src/services/skillRules.js`) is a fixed,
  curated list. Extending it means adding a new rule entry, not training a model.
- AI explanations depend on Gemini API availability; when it's down or
  unconfigured, the product degrades gracefully to evidence-only output
  rather than failing.

## Future improvements

- OAuth-based GitHub connection (instead of username-only) to safely support
  private repository analysis with proper scoped consent
- Commit-level evidence (frequency, authorship) in addition to repository-level signals
- Pagination and server-side filtering for large candidate/job lists
- Automated test suite (unit tests for the evidence engine and matching formulas)
