const mongoose = require('mongoose');

const pointsRecordSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '积分记录必须关联学生']
  },
  type: {
    type: String,
    enum: ['earn', 'deduct'],
    required: true
  },
  source: {
    type: String,
    enum: ['homework', 'checkin', 'share', 'manual', 'bonus', 'penalty'],
    required: true
  },
  sourceDetail: {
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Homework'
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HomeworkSubmission'
    },
    checkinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Checkin'
    },
    reason: String
  },
  amount: {
    type: Number,
    required: true,
    min: [1, '积分变动至少1分']
  },
  balance: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
  operatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

pointsRecordSchema.index({ studentId: 1, createdAt: -1 });
pointsRecordSchema.index({ studentId: 1, type: 1 });
pointsRecordSchema.index({ source: 1 });
pointsRecordSchema.index({ createdAt: -1 });

pointsRecordSchema.statics.getRecords = async function(studentId, options = {}) {
  const { page = 1, limit = 20, type, startDate, endDate } = options;
  const query = { studentId };
  
  if (type) {
    query.type = type;
  }
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
  }
  
  const [records, total] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    this.countDocuments(query)
  ]);
  
  return {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

pointsRecordSchema.statics.adjustPoints = async function(studentId, amount, type, source, description, operatedBy = null, sourceDetail = {}) {
  const User = mongoose.model('User');
  
  const user = await User.findById(studentId);
  if (!user) {
    throw new Error('用户不存在');
  }
  
  if (type === 'deduct' && user.points < amount) {
    throw new Error('积分不足');
  }
  
  const balance = type === 'earn' 
    ? user.points + amount 
    : user.points - amount;
  
  const record = await this.create({
    studentId,
    type,
    source,
    amount,
    balance,
    description,
    operatedBy,
    sourceDetail
  });
  
  await User.findByIdAndUpdate(studentId, {
    $inc: { points: type === 'earn' ? amount : -amount }
  });
  
  return record;
};

module.exports = mongoose.model('PointsRecord', pointsRecordSchema);
