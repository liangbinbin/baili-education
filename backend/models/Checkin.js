const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  homeworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homework',
    required: [true, '打卡必须关联作业']
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HomeworkSubmission'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '打卡必须关联学生']
  },
  date: {
    type: Date,
    default: Date.now
  },
  cycleIndex: {
    type: Number,
    default: 0
  },
  timeIndex: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 1
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  shareType: {
    type: String,
    enum: ['chat', 'moments', null],
    default: null
  }
}, {
  timestamps: true
});

checkinSchema.index({ homeworkId: 1, studentId: 1 });
checkinSchema.index({ studentId: 1, date: -1 });
checkinSchema.index({ studentId: 1 });
checkinSchema.index({ date: -1 });

checkinSchema.statics.calculateStreak = async function(studentId, homeworkId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdayCheckin = await this.findOne({
    studentId,
    homeworkId,
    date: { $gte: yesterday, $lt: today }
  });
  
  if (yesterdayCheckin) {
    return yesterdayCheckin.streak + 1;
  }
  
  const todayCheckin = await this.findOne({
    studentId,
    homeworkId,
    date: { $gte: today }
  });
  
  return todayCheckin ? todayCheckin.streak : 1;
};

checkinSchema.statics.getStats = async function(studentId) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const [totalCheckins, todayCheckins, maxStreakResult] = await Promise.all([
    this.countDocuments({ studentId }),
    this.countDocuments({ studentId, date: { $gte: startOfDay } }),
    this.findOne({ studentId }).sort({ streak: -1 })
  ]);
  
  const currentStreak = await this.getCurrentStreak(studentId);
  
  return {
    totalCheckins,
    currentStreak,
    maxStreak: maxStreakResult?.streak || 0,
    todayCheckins
  };
};

checkinSchema.statics.getCurrentStreak = async function(studentId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkins = await this.find({ studentId })
    .sort({ date: -1 })
    .limit(30);
  
  if (checkins.length === 0) return 0;
  
  let streak = 0;
  let expectedDate = new Date(today);
  
  for (const checkin of checkins) {
    const checkinDate = new Date(checkin.date);
    checkinDate.setHours(0, 0, 0, 0);
    
    if (checkinDate.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (streak === 0 && checkinDate.getTime() < expectedDate.getTime()) {
      expectedDate = new Date(checkinDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      streak = 1;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

module.exports = mongoose.model('Checkin', checkinSchema);
