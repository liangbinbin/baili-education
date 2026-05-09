const mongoose = require('mongoose');

const homeworkSubmissionSchema = new mongoose.Schema({
  homeworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homework',
    required: [true, '作业提交必须关联作业']
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '作业提交必须关联学生']
  },
  cycleIndex: {
    type: Number,
    default: 0
  },
  timeIndex: {
    type: Number,
    default: 0
  },
  cycleCompletionCount: {
    type: Number,
    default: 0
  },
  files: [{
    type: {
      type: String,
      enum: ['image', 'audio', 'video', 'document'],
      required: true
    },
    url: String,
    filename: String,
    size: Number,
    duration: Number
  }],
  comment: {
    type: String,
    trim: true,
    maxlength: [500, '备注最多500个字符']
  },
  submitDate: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isShared: {
    type: Boolean,
    default: false
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', null],
    default: null
  },
  teacherComment: {
    type: String,
    trim: true
  },
  voiceComment: {
    type: String
  },
  bonusPoints: {
    type: Number,
    default: 0
  },
  gradedAt: {
    type: Date,
    default: null
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

homeworkSubmissionSchema.index({ homeworkId: 1, studentId: 1 });
homeworkSubmissionSchema.index({ studentId: 1 });
homeworkSubmissionSchema.index({ submitDate: -1 });
homeworkSubmissionSchema.index({ gradedBy: 1 });

homeworkSubmissionSchema.statics.findByHomeworkAndStudent = function(homeworkId, studentId) {
  return this.find({ homeworkId, studentId }).sort({ submitDate: -1 });
};

homeworkSubmissionSchema.statics.getCompletionStatus = async function(homeworkId, studentId) {
  const submissions = await this.find({ homeworkId, studentId, isCompleted: true });
  return {
    total: submissions.length,
    latest: submissions[0]
  };
};

module.exports = mongoose.model('HomeworkSubmission', homeworkSubmissionSchema);
