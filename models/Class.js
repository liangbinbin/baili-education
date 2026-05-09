const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, '班级必须关联课程']
  },
  name: {
    type: String,
    required: [true, '班级名称不能为空'],
    trim: true,
    maxlength: [30, '班级名称最多30个字符']
  },
  teacherIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  headTeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  studentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  studentCount: {
    type: Number,
    default: 0
  },
  classType: {
    type: String,
    enum: ['formal', 'temporary'],
    default: 'formal'
  },
  classTypeText: {
    type: String,
    enum: ['正式班', '临时班'],
    default: '正式班'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  schedule: [{
    dayOfWeek: { 
      type: Number, 
      min: 1, 
      max: 7 
    },
    startTime: String,
    endTime: String
  }],
  scheduleType: {
    type: String,
    enum: ['cycle', 'schedule'],
    default: 'cycle'
  },
  classSchedule: [{
    sectionNum: Number,
    sectionName: String,
    date: Date,
    startTime: String,
    endTime: String,
    classroom: String,
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  }],
  classroom: {
    type: String,
    trim: true
  },
  classStatus: {
    type: String,
    enum: ['active', 'ongoing', 'paused', 'ended'],
    default: 'active'
  },
  classStatusText: {
    type: String,
    enum: ['正常', '进行中', '停课', '结班'],
    default: '正常'
  }
}, {
  timestamps: true
});

classSchema.index({ courseId: 1 });
classSchema.index({ name: 1 });
classSchema.index({ studentIds: 1 });
classSchema.index({ headTeacherId: 1 });
classSchema.index({ classStatus: 1 });

classSchema.pre('save', function(next) {
  if (this.studentIds) {
    this.studentCount = this.studentIds.length;
  }
  next();
});

module.exports = mongoose.model('Class', classSchema);
