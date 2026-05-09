const express = require('express');
const { courseService } = require('../services');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/list', protect, async (req, res) => {
  try {
    const { status, type } = req.query;
    
    const filter = {};
    if (status) filter.courseStatus = status;
    if (type) filter.courseType = type;

    const courses = await courseService.find(filter);

    res.success(courses);
  } catch (error) {
    res.error(500, 'SERVER_ERROR', '获取课程列表失败');
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const course = await courseService.findById(req.params.id);

    if (!course) {
      return res.error(404, 'NOT_FOUND', '课程不存在');
    }

    res.success(course);
  } catch (error) {
    res.error(500, 'SERVER_ERROR', '获取课程详情失败');
  }
});

module.exports = router;
