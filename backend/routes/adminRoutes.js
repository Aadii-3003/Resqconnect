const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const { getAllUsers, deleteUser, deleteRequest } = require('../controllers/adminController');

router.get('/users', protect, isAdmin, getAllUsers);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.delete('/requests/:id', protect, isAdmin, deleteRequest);

module.exports = router;