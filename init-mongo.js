db.createUser({
  user: 'bailiuser',
  pwd: 'bailipassword',
  roles: [
    {
      role: 'readWrite',
      db: 'baili_education'
    }
  ]
});

db = db.getSiblingDB('baili_education');

db.createCollection('users');
db.createCollection('courses');
db.createCollection('classes');
db.createCollection('homeworks');
db.createCollection('homeworkSubmissions');
db.createCollection('checkins');
db.createCollection('pointsRecords');

db.users.createIndex({ phone: 1 }, { unique: true });
db.homeworks.createIndex({ courseId: 1, deadline: 1 });
db.checkins.createIndex({ userId: 1, createdAt: -1 });
db.pointsRecords.createIndex({ userId: 1, createdAt: -1 });

print('✅ MongoDB initialization completed');
