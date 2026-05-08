const { pointsService, userService } = require('../services');
const { AppError } = require('../middleware/errorHandler');

const pointsController = {
  getMyPoints: async (req, res, next) => {
    try {
      const user = await userService.findById(req.userId);
      
      const records = await pointsService.find({ studentId: req.userId });
      
      const earned = records
        .filter(r => r.type === 'earn')
        .reduce((sum, r) => sum + r.amount, 0);
      
      const spent = records
        .filter(r => r.type === 'deduct')
        .reduce((sum, r) => sum + r.amount, 0);

      res.success({
        current: user.points || 0,
        earned,
        spent,
        history: earned - spent
      });
    } catch (error) {
      next(error);
    }
  },

  getRecords: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, type, source, startDate, endDate } = req.query;

      let records = await pointsService.find({ studentId: req.userId });

      if (type) {
        records = records.filter(r => r.type === type);
      }

      if (source) {
        records = records.filter(r => r.source === source);
      }

      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          records = records.filter(r => new Date(r.createdAt) >= start);
        }
      }

      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          records = records.filter(r => new Date(r.createdAt) <= end);
        }
      }

      records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      const start = (pageNum - 1) * limitNum;
      const end = start + limitNum;
      const paginatedRecords = records.slice(start, end);

      const enrichedRecords = paginatedRecords.map(record => ({
        ...record,
        typeText: record.type === 'earn' ? '获得' : '消耗',
        sourceText: getSourceText(record.source)
      }));

      res.paginated(enrichedRecords, {
        page: pageNum,
        limit: limitNum,
        total: records.length,
        pages: Math.ceil(records.length / limitNum)
      });
    } catch (error) {
      next(error);
    }
  },

  getRanking: async (req, res, next) => {
    try {
      const { period = 'week', scope = 'all', classId } = req.query;

      let startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'semester':
          startDate.setMonth(startDate.getMonth() - 4);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const allRecords = await pointsService.find({
        createdAt: { $gte: startDate }
      });

      const rankingMap = new Map();
      const userPointsMap = new Map();

      allRecords.forEach(record => {
        if (record.type === 'earn') {
          const current = rankingMap.get(record.studentId) || 0;
          rankingMap.set(record.studentId, current + record.amount);

          if (record.studentId === req.userId) {
            const userCurrent = userPointsMap.get(req.userId) || 0;
            userPointsMap.set(req.userId, userCurrent + record.amount);
          }
        }
      });

      const ranking = Array.from(rankingMap.entries())
        .map(([studentId, totalPoints]) => ({ studentId, totalPoints }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 100);

      const studentIds = ranking.map(r => r.studentId);
      const students = await Promise.all(
        studentIds.map(id => userService.findById(id))
      );
      const studentMap = new Map(students.filter(Boolean).map(s => [s._id, s]));

      const rankingWithUser = ranking.map((item, index) => {
        const user = studentMap.get(item.studentId);
        return {
          rank: index + 1,
          studentId: item.studentId,
          totalPoints: item.totalPoints,
          name: user?.name || '未知',
          avatar: user?.avatar || null,
          isCurrentUser: item.studentId === req.userId
        };
      });

      const myRank = rankingWithUser.find(r => r.isCurrentUser)?.rank || null;
      const myPoints = userPointsMap.get(req.userId) || 0;

      res.success({
        period,
        periodText: getPeriodText(period),
        startDate: startDate.toISOString(),
        myPoints,
        myRank,
        ranking: rankingWithUser
      });
    } catch (error) {
      next(error);
    }
  },

  adjustPoints: async (req, res, next) => {
    try {
      const { studentId, amount, type, description } = req.body;

      if (!['earn', 'deduct'].includes(type)) {
        throw new AppError('调整类型必须是earn或deduct', 400, 'INVALID_TYPE');
      }

      const amountNum = parseInt(amount) || 0;
      if (amountNum <= 0 || amountNum > 1000) {
        throw new AppError('调整积分必须在1-1000之间', 400, 'INVALID_AMOUNT');
      }

      const student = await userService.findById(studentId);
      if (!student) {
        throw new AppError('学生不存在', 404, 'NOT_FOUND');
      }

      if (type === 'deduct' && (student.points || 0) < amountNum) {
        throw new AppError('积分不足', 400, 'INSUFFICIENT_POINTS');
      }

      const currentBalance = student.points || 0;
      const newBalance = type === 'earn' ? currentBalance + amountNum : currentBalance - amountNum;

      const record = await pointsService.create({
        studentId,
        type,
        source: 'manual',
        amount: amountNum,
        balance: newBalance,
        description: description || (type === 'earn' ? '积分奖励' : '积分扣除'),
        operatedBy: req.userId
      });

      if (!record) {
        throw new AppError('积分记录创建失败', 500, 'RECORD_CREATE_FAILED');
      }

      const updateResult = await userService.findByIdAndUpdate(studentId, {
        points: newBalance
      });

      if (!updateResult) {
        throw new AppError('用户积分更新失败', 500, 'UPDATE_FAILED');
      }

      res.success({
        record,
        newBalance
      }, '积分调整成功');
    } catch (error) {
      next(error);
    }
  },

  getStatistics: async (req, res, next) => {
    try {
      const { period = 'month' } = req.query;

      let startDate = new Date();
      
      switch (period) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'semester':
          startDate.setMonth(startDate.getMonth() - 4);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 1);
      }

      const records = await pointsService.find({
        studentId: req.userId,
        createdAt: { $gte: startDate }
      });

      const dailyStats = {};
      const sourceStats = {};

      records.forEach(record => {
        const date = new Date(record.createdAt).toISOString().split('T')[0];
        
        if (!dailyStats[date]) {
          dailyStats[date] = { earn: 0, deduct: 0, total: 0 };
        }
        
        if (record.type === 'earn') {
          dailyStats[date].earn += record.amount;
          dailyStats[date].total += record.amount;
        } else {
          dailyStats[date].deduct += record.amount;
          dailyStats[date].total -= record.amount;
        }

        if (!sourceStats[record.source]) {
          sourceStats[record.source] = 0;
        }
        sourceStats[record.source] += record.amount;
      });

      const dailyData = Object.entries(dailyStats)
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const sourceData = Object.entries(sourceStats)
        .map(([source, amount]) => ({
          source,
          sourceText: getSourceText(source),
          amount
        }))
        .sort((a, b) => b.amount - a.amount);

      const totalEarned = records
        .filter(r => r.type === 'earn')
        .reduce((sum, r) => sum + r.amount, 0);
      
      const totalSpent = records
        .filter(r => r.type === 'deduct')
        .reduce((sum, r) => sum + r.amount, 0);

      res.success({
        period,
        periodText: getPeriodText(period),
        totalEarned,
        totalSpent,
        netChange: totalEarned - totalSpent,
        dailyData,
        sourceData
      });
    } catch (error) {
      next(error);
    }
  }
};

function getSourceText(source) {
  const map = {
    homework: '作业奖励',
    checkin: '打卡奖励',
    share: '分享奖励',
    bonus: '优秀奖励',
    penalty: '惩罚扣分',
    manual: '手动调整',
    attendance: '考勤奖励',
    other: '其他'
  };
  return map[source] || '未知来源';
}

function getPeriodText(period) {
  const map = {
    day: '今日',
    week: '本周',
    month: '本月',
    semester: '本学期',
    year: '本年',
    all: '全部'
  };
  return map[period] || '本周';
}

module.exports = pointsController;
