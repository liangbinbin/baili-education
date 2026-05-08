db.getSiblingDB('baili_education').createCollection('users');

db.getSiblingDB('baili_education').createUser({
  user: 'baili_user',
  pwd: 'baili_password_change_in_production',
  roles: [
    { role: 'readWrite', db: 'baili_education' }
  ]
});

db.getSiblingDB('baili_education').createIndex(
  { phone: 1 },
  { unique: true }
);

db.getSiblingDB('baili_education').createIndex(
  { 'userId': 1 }
);

db.getSiblingDB('baili_education').createIndex(
  { 'courseId': 1 }
);

db.getSiblingDB('baili_education').createIndex(
  { 'classId': 1 }
);

db.getSiblingDB('baili_education').createIndex(
  { createdAt: 1 }
);
