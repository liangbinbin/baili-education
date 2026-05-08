const users = [];
const courses = [];
const classes = [];
const homeworks = [];
const submissions = [];
const checkins = [];
const pointsRecords = [];

let userIdCounter = 1;
let courseIdCounter = 1;
let classIdCounter = 1;
let homeworkIdCounter = 1;
let submissionIdCounter = 1;
let checkinIdCounter = 1;
let pointsRecordIdCounter = 1;

const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const memoryDB = {
  User: {
    create: async (data) => {
      const user = {
        _id: generateId('user'),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(user);
      return user;
    },
    findOne: async (query) => {
      return users.find(u => {
        if (query.phone) return u.phone === query.phone;
        if (query._id) return u._id === query._id;
        return false;
      });
    },
    findById: async (id) => {
      return users.find(u => u._id === id);
    },
    find: async (query = {}) => {
      return users.filter(u => {
        if (query.role && u.role !== query.role) return false;
        if (query.isActive !== undefined && u.isActive !== query.isActive) return false;
        return true;
      });
    },
    findByIdAndUpdate: async (id, update) => {
      const index = users.findIndex(u => u._id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...update, updatedAt: new Date() };
        return users[index];
      }
      return null;
    },
    deleteMany: async () => {
      users.length = 0;
    }
  },

  Course: {
    create: async (data) => {
      const course = {
        _id: generateId('course'),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      courses.push(course);
      return course;
    },
    find: async (query = {}) => {
      return courses.filter(c => {
        if (query.courseStatus && c.courseStatus !== query.courseStatus) return false;
        if (query.courseType && c.courseType !== query.courseType) return false;
        return true;
      });
    },
    findById: async (id) => {
      return courses.find(c => c._id === id);
    },
    findByIdAndUpdate: async (id, update) => {
      const index = courses.findIndex(c => c._id === id);
      if (index !== -1) {
        courses[index] = { ...courses[index], ...update, updatedAt: new Date() };
        return courses[index];
      }
      return null;
    },
    deleteMany: async () => {
      courses.length = 0;
    }
  },

  Class: {
    create: async (data) => {
      const cls = {
        _id: generateId('class'),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      classes.push(cls);
      return cls;
    },
    find: async (query = {}) => {
      return classes.filter(c => {
        if (query.courseId && c.courseId !== query.courseId) return false;
        if (query.classStatus && c.classStatus !== query.classStatus) return false;
        return true;
      });
    },
    findById: async (id) => {
      return classes.find(c => c._id === id);
    },
    deleteMany: async () => {
      classes.length = 0;
    }
  },

  Homework: {
    create: async (data) => {
      const homework = {
        _id: generateId('homework'),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      homeworks.push(homework);
      return homework;
    },
    find: async (query = {}) => {
      return homeworks.filter(h => {
        if (query.courseId && h.courseId !== query.courseId) return false;
        if (query.classId && h.classId !== query.classId) return false;
        if (query.hasCheckin !== undefined && h.hasCheckin !== query.hasCheckin) return false;
        if (query.isPublished !== undefined && h.isPublished !== query.isPublished) return false;
        return true;
      });
    },
    findById: async (id) => {
      return homeworks.find(h => h._id === id);
    },
    deleteMany: async () => {
      homeworks.length = 0;
    }
  },

  HomeworkSubmission: {
    create: async (data) => {
      const submission = {
        _id: generateId('submission'),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      submissions.push(submission);
      return submission;
    },
    find: async (query = {}) => {
      return submissions.filter(s => {
        if (query.homeworkId && s.homeworkId !== query.homeworkId) return false;
        if (query.studentId && s.studentId !== query.studentId) return false;
        if (query.isCompleted !== undefined && s.isCompleted !== query.isCompleted) return false;
        return true;
      });
    },
    findOne: async (query) => {
      return submissions.find(s => {
        if (query.homeworkId && s.homeworkId !== query.homeworkId) return false;
        if (query.studentId && s.studentId !== query.studentId) return false;
        if (query.cycleIndex !== undefined && s.cycleIndex !== query.cycleIndex) return false;
        if (query.timeIndex !== undefined && s.timeIndex !== query.timeIndex) return false;
        return true;
      });
    },
    findByIdAndUpdate: async (id, update) => {
      const index = submissions.findIndex(s => s._id === id);
      if (index !== -1) {
        submissions[index] = { ...submissions[index], ...update, updatedAt: new Date() };
        return submissions[index];
      }
      return null;
    },
    findOneAndUpdate: async (query, update) => {
      const index = submissions.findIndex(s => {
        if (query.homeworkId && s.homeworkId !== query.homeworkId) return false;
        if (query.studentId && s.studentId !== query.studentId) return false;
        if (query.isCompleted !== undefined && s.isCompleted !== query.isCompleted) return false;
        return true;
      });
      if (index !== -1) {
        submissions[index] = { ...submissions[index], ...update, updatedAt: new Date() };
        return submissions[index];
      }
      return null;
    },
    deleteMany: async () => {
      submissions.length = 0;
    }
  },

  Checkin: {
    create: async (data) => {
      const checkin = {
        _id: generateId('checkin'),
        ...data,
        createdAt: new Date()
      };
      checkins.push(checkin);
      return checkin;
    },
    find: async (query = {}) => {
      return checkins.filter(c => {
        if (query.homeworkId && c.homeworkId !== query.homeworkId) return false;
        if (query.studentId && c.studentId !== query.studentId) return false;
        return true;
      });
    },
    findOne: async (query) => {
      return checkins.find(c => {
        if (query.homeworkId && c.homeworkId !== query.homeworkId) return false;
        if (query.studentId && c.studentId !== query.studentId) return false;
        if (query.cycleIndex !== undefined && c.cycleIndex !== query.cycleIndex) return false;
        if (query.timeIndex !== undefined && c.timeIndex !== query.timeIndex) return false;
        return true;
      });
    },
    deleteMany: async () => {
      checkins.length = 0;
    },
    getStats: async (studentId) => {
      const studentCheckins = checkins.filter(c => c.studentId === studentId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayCheckins = studentCheckins.filter(c => {
        const checkinDate = new Date(c.date);
        checkinDate.setHours(0, 0, 0, 0);
        return checkinDate.getTime() === today.getTime();
      });
      
      const maxStreak = studentCheckins.length > 0 
        ? Math.max(...studentCheckins.map(c => c.streak)) 
        : 0;
      
      return {
        totalCheckins: studentCheckins.length,
        currentStreak: maxStreak,
        maxStreak,
        todayCheckins: todayCheckins.length
      };
    }
  },

  PointsRecord: {
    create: async (data) => {
      const record = {
        _id: generateId('points'),
        ...data,
        createdAt: new Date()
      };
      pointsRecords.push(record);
      return record;
    },
    find: async (query = {}) => {
      return pointsRecords.filter(r => {
        if (query.studentId && r.studentId !== query.studentId) return false;
        if (query.type && r.type !== query.type) return false;
        return true;
      });
    },
    deleteMany: async () => {
      pointsRecords.length = 0;
    }
  }
};

module.exports = memoryDB;
