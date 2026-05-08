const express = require('express');
const checkinController = require('../controllers/checkinController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, checkinController.getStats);
router.get('/record', protect, checkinController.getRecords);
router.post('/submit', protect, checkinController.doCheckin);
router.get('/homework/:homeworkId/status', protect, checkinController.getHomeworkCheckinStatus);
router.get('/today', protect, checkinController.getTodayCheckins);

module.exports = router;
