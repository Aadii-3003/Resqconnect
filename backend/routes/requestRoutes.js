const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createRequest, getRequests, updateRequestStatus, getMyRequests } = require('../controllers/requestController');

router.post('/', protect, createRequest);
router.get('/', getRequests);
router.get('/mine', protect, getMyRequests);
router.patch('/:id', updateRequestStatus);

module.exports = router;