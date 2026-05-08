const bcrypt = require('bcryptjs');
const { User, Course, Class, Homework, HomeworkSubmission, Checkin, PointsRecord } = require('../utils/db');

const userService = {
  findById: async (id) => User.findById(id),
  findOne: async (query) => User.findOne(query),
  create: async (data) => User.create(data),
  findByIdAndUpdate: async (id, update) => User.findByIdAndUpdate(id, update),
  find: async (query) => User.find(query),
  comparePassword: async (candidatePassword, hashedPassword) => {
    if (User.comparePassword) {
      return User.comparePassword(candidatePassword, hashedPassword);
    }
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
};

const courseService = {
  find: async (query) => Course.find(query),
  findById: async (id) => Course.findById(id),
  create: async (data) => Course.create(data),
  findByIdAndUpdate: async (id, update) => Course.findByIdAndUpdate(id, update)
};

const classService = {
  find: async (query) => Class.find(query),
  findById: async (id) => Class.findById(id),
  create: async (data) => Class.create(data)
};

const homeworkService = {
  find: async (query) => Homework.find(query),
  findById: async (id) => Homework.findById(id),
  create: async (data) => Homework.create(data)
};

const submissionService = {
  find: async (query) => HomeworkSubmission.find(query),
  findOne: async (query) => HomeworkSubmission.findOne(query),
  create: async (data) => HomeworkSubmission.create(data),
  findById: async (id) => HomeworkSubmission.findById(id),
  findByIdAndUpdate: async (id, update) => HomeworkSubmission.findByIdAndUpdate(id, update),
  findOneAndUpdate: async (query, update) => HomeworkSubmission.findOneAndUpdate(query, update),
  update: async (id, update) => HomeworkSubmission.findByIdAndUpdate(id, update)
};

const checkinService = {
  create: async (data) => Checkin.create(data),
  find: async (query) => Checkin.find(query),
  findOne: async (query) => Checkin.findOne(query),
  findById: async (id) => Checkin.findById(id),
  findByIdAndUpdate: async (id, update) => Checkin.findByIdAndUpdate(id, update),
  getStats: async (studentId) => Checkin.getStats(studentId)
};

const pointsService = {
  create: async (data) => PointsRecord.create(data),
  find: async (query) => PointsRecord.find(query),
  findById: async (id) => PointsRecord.findById(id)
};

module.exports = {
  userService,
  courseService,
  classService,
  homeworkService,
  submissionService,
  checkinService,
  pointsService
};
