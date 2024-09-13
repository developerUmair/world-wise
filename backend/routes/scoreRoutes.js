const express = require('express');
const { saveScore, getScore } = require('../controllers/gameController');
const authenticateToken = require('../middleware/auth'); // JWT middleware

const router = express.Router();

// Save score route (protected route)
router.post('/save', saveScore);

// Get score route (protected route)
router.get('/get', getScore);

module.exports = router;
