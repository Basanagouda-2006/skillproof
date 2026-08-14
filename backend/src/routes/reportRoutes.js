const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { generateReport, listMyReports, getReport } = require('../controllers/reportController');

const router = express.Router();

router.post('/generate', requireAuth, requireRole('candidate'), generateReport);
router.get('/', requireAuth, requireRole('candidate'), listMyReports);
router.get('/:id', requireAuth, getReport);

module.exports = router;
