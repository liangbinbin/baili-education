const express = require('express');
const { classService } = require('../services');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/list', protect, async (req, res) => {
  try {
    const { courseId, status } = req.query;
    
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (status) filter.classStatus = status;

    const classes = await classService.find(filter);

    res.success(classes);
  } catch (error) {
    res.error(500, 'SERVER_ERROR', '获取班级列表失败');
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const classItem = await classService.findById(req.params.id);

    if (!classItem) {
      return res.error(404, 'NOT_FOUND', '班级不存在');
    }

    res.success(classItem);
  } catch (error) {
    res.error(500, 'SERVER_ERROR', '获取班级详情失败');
  }
});

module.exports = router;
