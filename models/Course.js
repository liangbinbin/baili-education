const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '课程名称不能为空'],
    trim: true,
    maxlength: [50, '课程名称最多50个字符']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, '课程描述最多500个字符']
  },
  level: {
    type: String,
    trim: true,
    maxlength: [20, '课程级别最多20个字符']
  },
  courseStatus: {
    type: String,
    enum: ['enrolling', 'ongoing', 'paused', 'ended'],
    default: 'enrolling'
  },
  suitableGrade: [{
    type: String,
    enum: ['kindergarten', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6', 'grade7', 'grade8', 'grade9']
  }],
  courseIntro: {
    type: String,
    trim: true,
    maxlength: [200, '课程简介最多200个字符']
  },
  courseType: {
    type: String,
    enum: ['main', 'elective', 'other'],
    default: 'main'
  },
  courseTypeText: {
    type: String,
    enum: ['主体系列课程', '辅助选修课程', '其他课程'],
    default: '主体系列课程'
  },
  teacherIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  classIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  sections: [{
    sectionNum: Number,
    name: String,
    duration: { type: Number, default: 60 }
  }],
  coverImage: {
    type: String,
    default: null
  },
  bannerImages: [{
    type: String
  }],
  courseDetail: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

courseSchema.index({ name: 1 });
courseSchema.index({ courseStatus: 1 });
courseSchema.index({ courseType: 1 });

module.exports = mongoose.model('Course', courseSchema);
