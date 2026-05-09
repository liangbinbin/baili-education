const { homeworkService, submissionService, userService, pointsService } = require('../services');
const { AppError } = require('../middleware/errorHandler');
const config = require('../config/app');

const homeworkController = {
  getHomeworkList: async (req, res, next) => {
    try {
      const { courseId, classId, hasCheckin } = req.query;
      
      const filter = {};
      if (courseId) filter.courseId = courseId;
      if (classId) filter.classId = classId;
      if (hasCheckin !== undefined) filter.hasCheckin = hasCheckin === 'true';

      const homeworks = await homeworkService.find(filter);

      const submissions = await submissionService.find({ studentId: req.userId });
      const submissionMap = new Map();
      submissions.forEach(s => {
        const key = `${s.homeworkId}_${s.cycleIndex}_${s.timeIndex}`;
        submissionMap.set(key, s);
      });

      const homeworksWithStatus = homeworks.map((homework) => {
        let completedCount = 0;
        const cyclesCount = homework.totalTasksCount || 1;
        
        for (let i = 0; i < cyclesCount; i++) {
          const key = `${homework._id}_${i}_0`;
          if (submissionMap.has(key)) {
            completedCount++;
          }
        }

        return {
          ...homework,
          completedTimes: completedCount,
          completedCycles: completedCount >= cyclesCount ? cyclesCount : 0,
          isCompleted: completedCount >= cyclesCount
        };
      });

      res.success(homeworksWithStatus);
    } catch (error) {
      next(error);
    }
  },

  getHomeworkDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const homework = await homeworkService.findById(id);
      if (!homework) {
        throw new AppError('作业不存在', 404, 'NOT_FOUND');
      }

      const submissions = await submissionService.find({
        homeworkId: homework._id,
        studentId: req.userId
      });

      const totalTasks = homework.totalTasksCount || 1;
      const completedTasks = submissions.filter(s => s.isCompleted).length;

      res.success({
        homework,
        submissions,
        progress: {
          total: totalTasks,
          completed: completedTasks,
          percentage: Math.round((completedTasks / totalTasks) * 100)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  submitHomework: async (req, res, next) => {
    try {
      const { homeworkId, cycleIndex = 0, timeIndex = 0, files = [], comment = '' } = req.body;

      if (!homeworkId) {
        throw new AppError('作业ID不能为空', 400, 'HOMEWORK_ID_REQUIRED');
      }

      const homework = await homeworkService.findById(homeworkId);
      if (!homework) {
        throw new AppError('作业不存在', 404, 'NOT_FOUND');
      }

      if (new Date() > new Date(homework.deadline)) {
        throw new AppError('作业已截止', 400, 'DEADLINE_PASSED');
      }

      const existingSubmission = await submissionService.findOne({
        homeworkId,
        studentId: req.userId,
        cycleIndex,
        timeIndex
      });

      let submission;
      let isNewSubmission = false;

      if (existingSubmission) {
        existingSubmission.files = files;
        existingSubmission.comment = comment;
        existingSubmission.submitDate = new Date();
        existingSubmission.isCompleted = true;
        submission = await submissionService.update(existingSubmission._id, existingSubmission);
      } else {
        isNewSubmission = true;
        submission = await submissionService.create({
          homeworkId,
          studentId: req.userId,
          cycleIndex,
          timeIndex,
          files,
          comment,
          isCompleted: true,
          submitDate: new Date()
        });
      }

      const totalTasksCount = homework.totalTasksCount || 1;
      const allSubmissions = await submissionService.find({
        homeworkId,
        studentId: req.userId,
        isCompleted: true
      });

      const isHomeworkCompleted = allSubmissions.length >= totalTasksCount;
      let earnedPoints = 0;

      if (isHomeworkCompleted && isNewSubmission) {
        earnedPoints = homework.points || config.points.default.homework;
        
        await pointsService.adjustPoints(
          req.userId,
          earnedPoints,
          'earn',
          'homework',
          `完成作业：${homework.title}`,
          null,
          { homeworkId }
        );
      }

      res.success({
        submitted: true,
        cycleIndex,
        timeIndex,
        isCompleted: isHomeworkCompleted,
        earnedPoints
      }, '作业提交成功');
    } catch (error) {
      next(error);
    }
  },

  shareHomework: async (req, res, next) => {
    try {
      const { homeworkId, shareType } = req.body;

      if (!homeworkId) {
        throw new AppError('作业ID不能为空', 400, 'HOMEWORK_ID_REQUIRED');
      }

      if (!['chat', 'moments'].includes(shareType)) {
        throw new AppError('无效的分享类型', 400, 'INVALID_SHARE_TYPE');
      }

      const homework = await homeworkService.findById(homeworkId);
      if (!homework) {
        throw new AppError('作业不存在', 404, 'NOT_FOUND');
      }

      const submission = await submissionService.findOne({
        homeworkId,
        studentId: req.userId,
        isCompleted: true
      });

      if (!submission) {
        throw new AppError('请先完成作业再分享', 400, 'HOMEWORK_NOT_COMPLETED');
      }

      if (submission.isShared) {
        throw new AppError('作业已分享过', 400, 'ALREADY_SHARED');
      }

      const sharePoints = homework.sharePoints || config.points.default.share;
      
      submission.isShared = true;
      submission.shareType = shareType;
      await submissionService.update(submission._id, submission);

      if (sharePoints > 0) {
        await pointsService.adjustPoints(
          req.userId,
          sharePoints,
          'earn',
          'share',
          shareType === 'moments' ? '朋友圈分享奖励' : '好友分享奖励',
          null,
          { homeworkId, shareType }
        );
      }

      res.success({
        shared: true,
        shareType,
        earnedPoints: sharePoints
      }, '分享成功');
    } catch (error) {
      next(error);
    }
  },

  gradeHomework: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { grade, teacherComment, voiceComment, bonusPoints = 0 } = req.body;

      if (!['A', 'B', 'C', 'D'].includes(grade)) {
        throw new AppError('评分必须是A/B/C/D', 400, 'INVALID_GRADE');
      }

      const submission = await submissionService.findById(id);
      if (!submission) {
        throw new AppError('提交记录不存在', 404, 'NOT_FOUND');
      }

      submission.grade = grade;
      submission.teacherComment = teacherComment || '';
      submission.voiceComment = voiceComment || '';
      submission.bonusPoints = bonusPoints;
      submission.gradedAt = new Date();
      submission.gradedBy = req.userId;

      await submissionService.update(submission._id, submission);

      if (bonusPoints > 0) {
        await pointsService.adjustPoints(
          submission.studentId,
          bonusPoints,
          'earn',
          'bonus',
          `作业批改奖励：${grade}等级`,
          req.userId,
          { homeworkId: submission.homeworkId, grade }
        );
      }

      const updatedSubmission = await submissionService.findById(submission._id);

      res.success(updatedSubmission, '批改成功');
    } catch (error) {
      next(error);
    }
  },

  getStudentSubmissions: async (req, res, next) => {
    try {
      const { homeworkId, studentId } = req.query;

      if (!homeworkId) {
        throw new AppError('作业ID不能为空', 400, 'HOMEWORK_ID_REQUIRED');
      }

      const filter = { homeworkId };
      if (studentId) filter.studentId = studentId;

      const submissions = await submissionService.find(filter);

      const studentIds = [...new Set(submissions.map(s => s.studentId))];
      const students = await Promise.all(
        studentIds.map(id => userService.findById(id))
      );
      const studentMap = new Map(students.filter(Boolean).map(s => [s._id, s]));

      const submissionsWithStudent = submissions.map(submission => {
        const student = studentMap.get(submission.studentId);
        return {
          ...submission,
          studentName: student?.name || '未知',
          studentAvatar: student?.avatar || null
        };
      });

      res.success(submissionsWithStudent);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = homeworkController;
