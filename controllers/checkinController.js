const { checkinService, homeworkService, userService, pointsService } = require('../services');
const { AppError } = require('../middleware/errorHandler');
const config = require('../config/app');

const checkinController = {
  getStats: async (req, res, next) => {
    try {
      const stats = await checkinService.getStats(req.userId);
      res.success(stats);
    } catch (error) {
      next(error);
    }
  },

  getRecords: async (req, res, next) => {
    try {
      const { homeworkId, page = 1, limit = 20 } = req.query;
      
      const filter = { studentId: req.userId };
      if (homeworkId) filter.homeworkId = homeworkId;

      const allRecords = await checkinService.find(filter);
      const start = (parseInt(page) - 1) * parseInt(limit);
      const end = start + parseInt(limit);

      const homeworkIds = [...new Set(allRecords.map(r => r.homeworkId))];
      const homeworks = await Promise.all(
        homeworkIds.map(id => homeworkService.findById(id))
      );
      const homeworkMap = new Map(homeworks.filter(Boolean).map(h => [h._id, h]));

      const enrichedRecords = allRecords.slice(start, end).map(record => {
        const homework = homeworkMap.get(record.homeworkId);
        return {
          ...record,
          homeworkTitle: homework?.title || '未知作业'
        };
      });

      res.paginated(enrichedRecords, {
        page: parseInt(page),
        limit: parseInt(limit),
        total: allRecords.length,
        pages: Math.ceil(allRecords.length / limit)
      });
    } catch (error) {
      next(error);
    }
  },

  doCheckin: async (req, res, next) => {
    try {
      const { homeworkId, cycleIndex = 0, timeIndex = 0, shareType = null } = req.body;

      if (!homeworkId) {
        throw new AppError('作业ID不能为空', 400, 'HOMEWORK_ID_REQUIRED');
      }

      const homework = await homeworkService.findById(homeworkId);
      if (!homework) {
        throw new AppError('作业不存在', 404, 'NOT_FOUND');
      }

      if (!homework.hasCheckin) {
        throw new AppError('该作业不是打卡作业', 400, 'NOT_CHECKIN_HOMEWORK');
      }

      if (new Date() > new Date(homework.deadline)) {
        throw new AppError('作业已截止，无法打卡', 400, 'DEADLINE_PASSED');
      }

      const existingCheckin = await checkinService.findOne({
        homeworkId,
        studentId: req.userId,
        cycleIndex,
        timeIndex
      });

      if (existingCheckin) {
        throw new AppError('该周期已完成打卡', 400, 'ALREADY_CHECKIN');
      }

      const calculatedStreak = await checkinService.calculateStreak
        ? await checkinService.calculateStreak(req.userId, homeworkId)
        : 1;
      const checkinPoints = homework.checkinPoints || config.points.default.checkin;
      const sharePoints = shareType === 'moments' 
        ? (homework.sharePoints || config.points.default.share) 
        : 0;
      const totalPoints = checkinPoints + sharePoints;

      const checkin = await checkinService.create({
        homeworkId,
        studentId: req.userId,
        cycleIndex,
        timeIndex,
        streak: calculatedStreak,
        pointsEarned: checkinPoints,
        shareType,
        date: new Date()
      });

      if (totalPoints > 0) {
        const description = shareType === 'moments' 
          ? '打卡+朋友圈分享奖励' 
          : '打卡奖励';

        await pointsService.adjustPoints(
          req.userId,
          totalPoints,
          'earn',
          'checkin',
          description,
          null,
          { homeworkId, checkinId: checkin._id, shareType }
        );
      }

      const stats = await checkinService.getStats(req.userId);

      res.success({
        checkin,
        pointsEarned: totalPoints,
        currentStreak: stats.currentStreak,
        totalCheckins: stats.totalCheckins
      }, '打卡成功');
    } catch (error) {
      next(error);
    }
  },

  getHomeworkCheckinStatus: async (req, res, next) => {
    try {
      const { homeworkId } = req.params;

      if (!homeworkId) {
        throw new AppError('作业ID不能为空', 400, 'HOMEWORK_ID_REQUIRED');
      }

      const homework = await homeworkService.findById(homeworkId);
      if (!homework) {
        throw new AppError('作业不存在', 404, 'NOT_FOUND');
      }

      const checkins = await checkinService.find({
        homeworkId,
        studentId: req.userId
      });

      const totalCycles = homework.totalTasksCount || 1;
      const completedCycles = checkins.length;

      res.success({
        homeworkId,
        totalCycles,
        completedCycles,
        isCompleted: completedCycles >= totalCycles,
        checkins: checkins.map(c => ({
          cycleIndex: c.cycleIndex,
          timeIndex: c.timeIndex,
          date: c.date,
          streak: c.streak,
          pointsEarned: c.pointsEarned
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  getTodayCheckins: async (req, res, next) => {
    try {
      const { homeworkId } = req.query;

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const filter = { studentId: req.userId };
      
      if (homeworkId) filter.homeworkId = homeworkId;

      let checkins = await checkinService.find(filter);
      
      checkins = checkins.filter(c => {
        const checkinDate = new Date(c.date);
        return checkinDate >= todayStart && checkinDate < todayEnd;
      });

      const homeworkIds = [...new Set(checkins.map(c => c.homeworkId))];
      const homeworks = await Promise.all(
        homeworkIds.map(id => homeworkService.findById(id))
      );
      const homeworkMap = new Map(homeworks.filter(Boolean).map(h => [h._id, h]));

      const enrichedCheckins = checkins.map(checkin => {
        const homework = homeworkMap.get(checkin.homeworkId);
        return {
          ...checkin,
          homeworkTitle: homework?.title || '未知作业'
        };
      });

      res.success({
        count: enrichedCheckins.length,
        checkins: enrichedCheckins
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = checkinController;
