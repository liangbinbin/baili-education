const express = require('express');
const { userService, courseService, classService, homeworkService, checkinService } = require('../services');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/init', protect, async (req, res) => {
  try {
    const user = await userService.findById(req.userId);

    const courses = await courseService.find();
    const classes = await classService.find();
    const homeworks = await homeworkService.find({ isPublished: true });
    const checkinStats = await checkinService.getStats(req.userId);

    const enrichedHomeworks = homeworks.map((homework) => ({
      ...homework,
      cyclesCount: homework.totalTasksCount || 1,
      totalTasksCount: homework.totalTasksCount || 1,
      completedTimes: 0,
      completedCycles: 0,
      isCompleted: false
    }));

    res.success({
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        gender: user.gender,
        birthday: user.birthday,
        role: user.role,
        points: user.points || 0,
        classIds: user.classIds || []
      },
      courses,
      classes,
      homeworks: enrichedHomeworks,
      checkinStats
    });
  } catch (error) {
    res.error(500, 'SERVER_ERROR', '获取初始化数据失败');
  }
});

module.exports = router;
