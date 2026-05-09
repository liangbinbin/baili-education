const config = require('../config/app');

let models;

if (config.dbMode === 'mongodb') {
  models = {
    User: require('../models/User'),
    Course: require('../models/Course'),
    Class: require('../models/Class'),
    Homework: require('../models/Homework'),
    HomeworkSubmission: require('../models/HomeworkSubmission'),
    Checkin: require('../models/Checkin'),
    PointsRecord: require('../models/PointsRecord')
  };
} else {
  const memoryDB = require('../utils/memoryDB');
  models = {
    User: memoryDB.User,
    Course: memoryDB.Course,
    Class: memoryDB.Class,
    Homework: memoryDB.Homework,
    HomeworkSubmission: memoryDB.HomeworkSubmission,
    Checkin: memoryDB.Checkin,
    PointsRecord: memoryDB.PointsRecord
  };
}

module.exports = models;
