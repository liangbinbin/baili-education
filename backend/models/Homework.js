const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, '作业必须关联课程']
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, '作业必须关联班级']
  },
  title: {
    type: String,
    required: [true, '作业标题不能为空'],
    trim: true,
    maxlength: [100, '作业标题最多100个字符']
  },
  content: {
    type: String,
    trim: true,
    maxlength: [2000, '作业内容最多2000个字符']
  },
  publishTime: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: [true, '截止时间不能为空']
  },
  points: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  cycle: {
    type: {
      type: String,
      enum: ['single', 'multi'],
      default: 'single'
    },
    durationDays: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  frequency: {
    timesPerCycle: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  hasCheckin: {
    type: Boolean,
    default: false
  },
  checkinPoints: {
    type: Number,
    default: 5,
    min: 0
  },
  sharePoints: {
    type: Number,
    default: 10,
    min: 0
  },
  shareText: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

homeworkSchema.index({ courseId: 1 });
homeworkSchema.index({ classId: 1 });
homeworkSchema.index({ publishTime: -1 });
homeworkSchema.index({ deadline: 1 });
homeworkSchema.index({ hasCheckin: 1 });

homeworkSchema.virtual('cyclesCount').get(function() {
  if (this.cycle.type === 'single') {
    return 1;
  }
  
  const totalDays = Math.ceil((this.deadline - this.publishTime) / (1000 * 60 * 60 * 24)) + 1;
  return Math.ceil(totalDays / (this.cycle.durationDays || 1));
});

homeworkSchema.virtual('totalTasksCount').get(function() {
  const cycles = this.cyclesCount || 1;
  const timesPerCycle = this.frequency?.timesPerCycle || 1;
  return cycles * timesPerCycle;
});

homeworkSchema.set('toJSON', { virtuals: true });
homeworkSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Homework', homeworkSchema);
