const express = require('express');
const homeworkController = require('../controllers/homeworkController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/list', protect, homeworkController.getHomeworkList);
router.get('/:id', protect, homeworkController.getHomeworkDetail);
router.post('/submit', protect, homeworkController.submitHomework);
router.post('/share', protect, homeworkController.shareHomework);
router.put('/grade/:id', protect, restrictTo('admin', 'teacher'), homeworkController.gradeHomework);
router.get('/submissions/list', protect, restrictTo('admin', 'teacher'), homeworkController.getStudentSubmissions);

module.exports = router;
