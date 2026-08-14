const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const githubRoutes = require('./routes/githubRoutes');
const repositoryRoutes = require('./routes/repositoryRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const jobRoutes = require('./routes/jobRoutes');
const matchRoutes = require('./routes/matchRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const noteRoutes = require('./routes/noteRoutes');
const shareRoutes = require('./routes/shareRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

// General API rate limit (auth routes have their own stricter limiter)
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/health', healthRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
