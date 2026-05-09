const express = require('express');
const pointsController = require('../controllers/pointsController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, pointsController.getMyPoints);
router.get('/records', protect, pointsController.getRecords);
router.get('/ranking', protect, pointsController.getRanking);
router.get('/statistics', protect, pointsController.getStatistics);
router.post('/adjust', protect, restrictTo('admin', 'teacher'), pointsController.adjustPoints);

module.exports = router;
