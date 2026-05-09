#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/backend/.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const config = require('./backend/config/app');

const User = require('./backend/models/User');
const Course = require('./backend/models/Course');
const Class = require('./backend/models/Class');
const Homework = require('./backend/models/Homework');
const HomeworkSubmission = require('./backend/models/HomeworkSubmission');
const Checkin = require('./backend/models/Checkin');
const PointsRecord = require('./backend/models/PointsRecord');

const BACKUP_DIR = path.join(__dirname, 'backups');

const COLLECTIONS = ['users', 'courses', 'classes', 'homeworks', 'submissions', 'checkins', 'pointsRecords'];

async function backupFromMemoryDB() {
  console.log('📦 从内存数据库导出数据...\n');

  try {
    const memoryDB = require('./backend/utils/memoryDB');

    const data = {};

    for (const collection of COLLECTIONS) {
      let items;
      switch(collection) {
        case 'users':
          items = await memoryDB.users.find();
          break;
        case 'courses':
          items = await memoryDB.courses.find();
          break;
        case 'classes':
          items = await memoryDB.classes.find();
          break;
        case 'homeworks':
          items = await memoryDB.homeworks.find();
          break;
        case 'submissions':
          items = await memoryDB.homeworkSubmissions.find();
          break;
        case 'checkins':
          items = await memoryDB.checkins.find();
          break;
        case 'pointsRecords':
          items = await memoryDB.pointsRecords.find();
          break;
      }
      data[collection] = items || [];
      console.log(`  ✅ ${collection}: ${data[collection].length} 条记录`);
    }

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);

    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    console.log(`\n💾 数据已备份到: ${backupFile}`);

    return backupFile;
  } catch (error) {
    console.error('❌ 备份失败:', error.message);
    throw error;
  }
}

async function restoreToMongoDB(backupFile) {
  console.log('📥 开始恢复数据到 MongoDB...\n');

  try {
    if (fs.existsSync(config.mongodb.uri)) {
      console.log('⚠️  数据库已有数据，是否继续？');
      console.log('   将执行以下操作:');
      console.log('   1. 清空现有数据');
      console.log('   2. 从备份文件恢复数据');
      console.log('   3. 重新建立关联关系\n');
    }

    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log('✅ MongoDB 连接成功\n');

    console.log('🗑️ 清空现有数据...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Class.deleteMany({});
    await Homework.deleteMany({});
    await HomeworkSubmission.deleteMany({});
    await Checkin.deleteMany({});
    await PointsRecord.deleteMany({});
    console.log('✅ 清空完成\n');

    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

    console.log('📝 恢复数据...\n');

    console.log('  👤 恢复用户...');
    const users = await User.insertMany(backupData.users.map(u => ({
      ...u,
      _id: undefined,
      createdAt: u.createdAt || new Date(),
      updatedAt: new Date()
    })));
    console.log(`     ✅ ${users.length} 个用户`);

    const userMap = {};
    backupData.users.forEach((u, i) => {
      userMap[u._id] = users[i]._id;
    });

    console.log('  📚 恢复课程...');
    const courses = await Course.insertMany(backupData.courses.map(c => ({
      ...c,
      _id: undefined,
      teacherIds: (c.teacherIds || []).map(id => userMap[id]).filter(Boolean),
      classIds: (c.classIds || []).map(id => {
        const newId = Object.values(userMap).find(v => v);
        return newId;
      }).filter(Boolean),
      createdAt: c.createdAt || new Date(),
      updatedAt: new Date()
    })));
    console.log(`     ✅ ${courses.length} 门课程`);

    const courseMap = {};
    backupData.courses.forEach((c, i) => {
      courseMap[c._id] = courses[i]._id;
    });

    console.log('  🏫 恢复班级...');
    const classes = await Class.insertMany(backupData.classes.map(c => ({
      ...c,
      _id: undefined,
      courseId: courseMap[c.courseId?._id || c.courseId] || courses[0]?._id,
      teacherIds: (c.teacherIds || []).map(t => t?._id || t).map(id => userMap[id]).filter(Boolean),
      headTeacherId: c.headTeacherId ? userMap[c.headTeacherId?._id || c.headTeacherId] : undefined,
      studentIds: (c.studentIds || []).map(s => s?._id || s).map(id => userMap[id]).filter(Boolean),
      createdAt: c.createdAt || new Date(),
      updatedAt: new Date()
    })));
    console.log(`     ✅ ${classes.length} 个班级`);

    const classMap = {};
    backupData.classes.forEach((c, i) => {
      classMap[c._id] = classes[i]._id;
    });

    console.log('  📝 恢复作业...');
    const homeworks = await Homework.insertMany(backupData.homeworks.map(h => ({
      ...h,
      _id: undefined,
      courseId: courseMap[h.courseId?._id || h.courseId] || courses[0]?._id,
      classId: classMap[h.classId?._id || h.classId] || classes[0]?._id,
      createdBy: h.createdBy ? userMap[h.createdBy] : undefined,
      createdAt: h.createdAt || new Date(),
      updatedAt: new Date()
    })));
    console.log(`     ✅ ${homeworks.length} 个作业`);

    const homeworkMap = {};
    backupData.homeworks.forEach((h, i) => {
      homeworkMap[h._id] = homeworks[i]._id;
    });

    console.log('  📤 恢复作业提交...');
    const submissions = await HomeworkSubmission.insertMany(backupData.submissions.map(s => ({
      ...s,
      _id: undefined,
      homeworkId: homeworkMap[s.homeworkId] || homeworks[0]?._id,
      studentId: userMap[s.studentId] || users[0]?._id,
      gradedBy: s.gradedBy ? userMap[s.gradedBy] : undefined,
      createdAt: s.createdAt || new Date()
    })));
    console.log(`     ✅ ${submissions.length} 条提交记录`);

    const submissionMap = {};
    backupData.submissions.forEach((s, i) => {
      submissionMap[s._id] = submissions[i]._id;
    });

    console.log('  ✅ 恢复打卡记录...');
    const checkins = await Checkin.insertMany(backupData.checkins.map(c => ({
      ...c,
      _id: undefined,
      homeworkId: homeworkMap[c.homeworkId] || homeworks[0]?._id,
      studentId: userMap[c.studentId] || users[0]?._id,
      submissionId: c.submissionId ? submissionMap[c.submissionId] : undefined,
      createdAt: c.createdAt || new Date()
    })));
    console.log(`     ✅ ${checkins.length} 条打卡记录`);

    console.log('  💰 恢复积分记录...');
    const pointsRecords = await PointsRecord.insertMany(backupData.pointsRecords.map(p => ({
      ...p,
      _id: undefined,
      studentId: userMap[p.studentId] || users[0]?._id,
      operatedBy: p.operatedBy ? userMap[p.operatedBy] : undefined,
      createdAt: p.createdAt || new Date()
    })));
    console.log(`     ✅ ${pointsRecords.length} 条积分记录`);

    console.log('\n🔗 更新关联关系...');

    for (const course of courses) {
      const relatedClasses = classes.filter(c =>
        c.courseId?.toString() === course._id?.toString()
      );
      if (relatedClasses.length > 0) {
        course.classIds = relatedClasses.map(c => c._id);
        await course.save();
      }
    }
    console.log('  ✅ 课程-班级关系更新完成');

    for (const cls of classes) {
      const relatedHomeworks = homeworks.filter(h =>
        h.classId?.toString() === cls._id?.toString()
      );
      if (relatedHomeworks.length > 0) {
        const course = courses.find(c => c._id?.toString() === cls.courseId?.toString());
        if (course) {
          course.teacherIds = course.teacherIds || [];
          if (!course.teacherIds.find(t => t?.toString() === cls.headTeacherId?.toString())) {
            course.teacherIds.push(cls.headTeacherId);
          }
          await course.save();
        }
      }

      cls.studentIds = cls.studentIds || [];
      for (const studentId of cls.studentIds) {
        const student = users.find(u => u._id?.toString() === studentId?.toString());
        if (student) {
          student.classIds = student.classIds || [];
          if (!student.classIds.find(c => c?.toString() === cls._id?.toString())) {
            student.classIds.push(cls._id);
          }
          await student.save();
        }
      }
    }
    console.log('  ✅ 班级-用户关系更新完成');

    console.log('\n🎉 数据迁移完成！\n');

    console.log('📊 数据统计:');
    console.log(`   用户: ${users.length}`);
    console.log(`   课程: ${courses.length}`);
    console.log(`   班级: ${classes.length}`);
    console.log(`   作业: ${homeworks.length}`);
    console.log(`   提交: ${submissions.length}`);
    console.log(`   打卡: ${checkins.length}`);
    console.log(`   积分: ${pointsRecords.length}`);

    await mongoose.disconnect();
    console.log('\n✅ MongoDB 连接已关闭');

  } catch (error) {
    console.error('\n❌ 数据恢复失败:', error.message);
    throw error;
  }
}

async function runMigration() {
  const args = process.argv.slice(2);
  const action = args[0] || 'backup';

  console.log('═══════════════════════════════════════════════════════════');
  console.log('       百里教学管理系统 - 数据迁移工具');
  console.log('═══════════════════════════════════════════════════════════\n');

  switch(action) {
    case 'backup':
      console.log('📦 模式: 从内存数据库备份\n');
      await backupFromMemoryDB();
      break;

    case 'restore':
      const backupFile = args[1];
      if (!backupFile) {
        const files = fs.readdirSync(BACKUP_DIR)
          .filter(f => f.endsWith('.json'))
          .sort()
          .reverse();
        if (files.length === 0) {
          console.error('❌ 没有找到备份文件，请先执行: node scripts/migrate.js backup');
          process.exit(1);
        }
        console.log('📁 可用的备份文件:');
        files.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
        console.log(`\n使用最新备份: ${files[0]}`);
        await restoreToMongoDB(path.join(BACKUP_DIR, files[0]));
      } else {
        await restoreToMongoDB(backupFile);
      }
      break;

    case 'full':
      console.log('🔄 模式: 完整迁移（备份 + 恢复）\n');
      const file = await backupFromMemoryDB();
      await restoreToMongoDB(file);
      break;

    case 'list':
      console.log('📁 备份文件列表:\n');
      if (!fs.existsSync(BACKUP_DIR)) {
        console.log('   没有备份文件');
      } else {
        const files = fs.readdirSync(BACKUP_DIR)
          .filter(f => f.endsWith('.json'))
          .sort()
          .reverse();
        if (files.length === 0) {
          console.log('   没有备份文件');
        } else {
          files.forEach(f => {
            const stats = fs.statSync(path.join(BACKUP_DIR, f));
            const size = (stats.size / 1024).toFixed(2);
            console.log(`   ${f} (${size} KB)`);
          });
        }
      }
      break;

    case 'clear':
      console.log('⚠️  模式: 清空 MongoDB 数据\n');
      try {
        await mongoose.connect(config.mongodb.uri, config.mongodb.options);
        console.log('✅ MongoDB 连接成功\n');
        console.log('🗑️ 清空所有数据...');
        await User.deleteMany({});
        await Course.deleteMany({});
        await Class.deleteMany({});
        await Homework.deleteMany({});
        await HomeworkSubmission.deleteMany({});
        await Checkin.deleteMany({});
        await PointsRecord.deleteMany({});
        console.log('✅ 数据清空完成');
        await mongoose.disconnect();
      } catch (error) {
        console.error('❌ 清空失败:', error.message);
      }
      break;

    default:
      console.log('用法:');
      console.log('  node scripts/migrate.js backup    # 从内存数据库备份');
      console.log('  node scripts/migrate.js restore  # 从备份恢复（使用最新）');
      console.log('  node scripts/migrate.js restore <file>  # 从指定文件恢复');
      console.log('  node scripts/migrate.js full     # 完整迁移（备份+恢复）');
      console.log('  node scripts/migrate.js list    # 列出备份文件');
      console.log('  node scripts/migrate.js clear    # 清空MongoDB数据');
  }
}

runMigration().catch(console.error);
