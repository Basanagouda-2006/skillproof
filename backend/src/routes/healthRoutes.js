const express = require('express');
const { getDBStatus } = require('../config/db');
const { isAIAvailable } = require('../services/geminiService');
const env = require('../config/env');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDBStatus();
  res.status(db.connected ? 200 : 503).json({
    success: db.connected,
    data: {
      status: db.connected ? 'ok' : 'degraded',
      database: db,
      aiAvailable: isAIAvailable(),
      githubConfigured: Boolean(env.githubToken),
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;
