const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listMyRepositories, getRepository } = require('../controllers/repositoryController');

const router = express.Router();

router.get('/', requireAuth, listMyRepositories);
router.get('/:id', requireAuth, getRepository);

module.exports = router;
