const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { register, login, getMe, updateAvailability } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/availability', protect, updateAvailability);

module.exports = router;