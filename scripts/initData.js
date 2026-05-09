require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const config = require('../config/app');

const User = require('../models/User');
const Course = require('../models/Course');
const Class = require('../models/Class');
const Homework = require('../models/Homework');

const sampleData = {
  users: [
    {
      phone: '13800138001',
      password: '123456',
      name: '张三',
      role: 'admin',
      gender: 'male'
    },
    {
      phone: '13800138002',
      password: '123456',
      name: '李老师',
      role: 'teacher',
      gender: 'female'
    },
    {
      phone: '13800138003',
      password: '123456',
      name: '王老师',
      role: 'teacher',
      gender: 'male'
    },
    {
      phone: '13800138004',
      password: '123456',
      name: '小明',
      role: 'student',
      gender: 'male',
      points: 150
    },
    {
      phone: '13800138005',
      password: '123456',
      name: '小红',
      role: 'student',
      gender: 'female',
      points: 200
    },
    {
      phone: '13800138006',
      password: '123456',
      name: '小刚',
      role: 'student',
      gender: 'male',
      points: 180
    },
    {
      phone: '13800138007',
      password: '123456',
      name: '小美',
      role: 'student',
      gender: 'female',
      points: 220
    },
    {
      phone: '13800138008',
      password: '123456',
      name: '小华',
      role: 'student',
      gender: 'male',
      points: 90
    }
  ],

  courses: [
    {
      name: '口才基础班',
      description: '培养孩子良好的语言表达能力和自信心',
      level: '入门',
      courseStatus: 'ongoing',
      suitableGrade: ['grade1', 'grade2'],
      courseIntro: '通过有趣的故事和游戏，让孩子爱上表达',
      courseType: 'main',
      courseTypeText: '主体系列课程',
      courseDetail: '课程内容包括：发音训练、故事讲述、即兴表达、演讲技巧等。采用小班教学，每班不超过15人，确保每个孩子都能得到充分的关注和指导。'
    },
    {
      name: '演讲进阶班',
      description: '提升演讲技巧，培养领袖气质',
      level: '进阶',
      courseStatus: 'ongoing',
      suitableGrade: ['grade3', 'grade4', 'grade5'],
      courseIntro: '系统学习演讲技巧，成为舞台上的小明星',
      courseType: 'main',
      courseTypeText: '主体系列课程',
      courseDetail: '课程内容包括：演讲稿写作、肢体语言、声音控制、舞台表现等。定期举办演讲比赛，让孩子在实践中成长。'
    },
    {
      name: '主持特训营',
      description: '专业主持人培训课程',
      level: '高级',
      courseStatus: 'enrolling',
      suitableGrade: ['grade4', 'grade5', 'grade6'],
      courseIntro: '从零基础到专业主持人的蜕变之旅',
      courseType: 'elective',
      courseTypeText: '辅助选修课程',
      courseDetail: '课程内容包括：主持词创作、现场应变、镜头表现、节目策划等。优秀学员将有机会参与学校各类活动主持。'
    },
    {
      name: '朗诵艺术班',
      description: '感受语言之美，传承经典文化',
      level: '中级',
      courseStatus: 'ongoing',
      suitableGrade: ['grade2', 'grade3', 'grade4'],
      courseIntro: '在朗诵中感受文学的魅力',
      courseType: 'elective',
      courseTypeText: '辅助选修课程',
      courseDetail: '课程内容包括：古诗词朗诵、现代诗歌朗诵、散文朗诵等。通过朗诵培养语感和文学素养。'
    }
  ],

  classes: [
    {
      name: '口才基础1班',
      classType: 'formal',
      classTypeText: '正式班',
      classStatus: 'ongoing',
      classStatusText: '正常',
      classroom: 'A1教室',
      scheduleType: 'cycle',
      schedule: [
        { dayOfWeek: 2, startTime: '14:00', endTime: '15:30' },
        { dayOfWeek: 5, startTime: '18:30', endTime: '20:00' }
      ]
    },
    {
      name: '口才基础2班',
      classType: 'formal',
      classTypeText: '正式班',
      classStatus: 'ongoing',
      classStatusText: '正常',
      classroom: 'A2教室',
      scheduleType: 'cycle',
      schedule: [
        { dayOfWeek: 3, startTime: '10:00', endTime: '11:30' },
        { dayOfWeek: 6, startTime: '14:00', endTime: '15:30' }
      ]
    },
    {
      name: '演讲进阶1班',
      classType: 'formal',
      classTypeText: '正式班',
      classStatus: 'ongoing',
      classStatusText: '正常',
      classroom: 'B1教室',
      scheduleType: 'cycle',
      schedule: [
        { dayOfWeek: 1, startTime: '18:30', endTime: '20:00' },
        { dayOfWeek: 4, startTime: '18:30', endTime: '20:00' }
      ]
    },
    {
      name: '朗诵艺术班',
      classType: 'formal',
      classTypeText: '正式班',
      classStatus: 'active',
      classStatusText: '正常',
      classroom: 'C1教室',
      scheduleType: 'cycle',
      schedule: [
        { dayOfWeek: 2, startTime: '10:00', endTime: '11:30' },
        { dayOfWeek: 5, startTime: '10:00', endTime: '11:30' }
      ]
    }
  ],

  homeworks: [
    {
      title: '自我介绍练习',
      content: '请录制一段1分钟的自我介绍视频，要求：1. 声音洪亮清晰 2. 表情自然大方 3. 内容包括姓名、年龄、爱好',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      points: 10,
      hasCheckin: false,
      cycle: { type: 'single', durationDays: 1 },
      frequency: { timesPerCycle: 1 }
    },
    {
      title: '每日朗读打卡',
      content: '每天朗读一篇课文，录制音频提交。要求：1. 发音准确 2. 有感情地朗读 3. 每日坚持',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      points: 5,
      hasCheckin: true,
      checkinPoints: 5,
      sharePoints: 10,
      shareText: '我正在参加口才训练打卡，今天是第X天！',
      cycle: { type: 'multi', durationDays: 1 },
      frequency: { timesPerCycle: 1 }
    },
    {
      title: '故事演讲准备',
      content: '准备一个3分钟的故事演讲，主题：我的梦想。要求：1. 结构清晰 2. 有开头、发展、高潮、结尾 3. 脱稿演讲',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      points: 15,
      hasCheckin: false,
      cycle: { type: 'single', durationDays: 1 },
      frequency: { timesPerCycle: 1 }
    },
    {
      title: '绕口令挑战',
      content: '练习以下绕口令："四是四，十是十，十四是十四，四十是四十"。录制视频提交，要求：1. 发音清晰 2. 语速适中 3. 表情自然',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      points: 8,
      hasCheckin: true,
      checkinPoints: 3,
      sharePoints: 5,
      shareText: '绕口令挑战完成！',
      cycle: { type: 'multi', durationDays: 3 },
      frequency: { timesPerCycle: 1 }
    },
    {
      title: '即兴演讲练习',
      content: '随机抽取一个题目，进行1分钟即兴演讲。题目包括：我的学校、我的家人、我最喜欢的季节等',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      points: 12,
      hasCheckin: false,
      cycle: { type: 'single', durationDays: 1 },
      frequency: { timesPerCycle: 1 }
    }
  ]
};

const initData = async () => {
  console.log('🔄 开始初始化数据...');

  try {
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log('✅ MongoDB 连接成功');

    console.log('🗑️ 清空现有数据...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Class.deleteMany({});
    await Homework.deleteMany({});
    console.log('✅ 数据清空完成');

    console.log('👤 创建用户...');
    const users = await User.create(sampleData.users);
    const admin = users[0];
    const teacher1 = users[1];
    const teacher2 = users[2];
    const students = users.slice(3);
    console.log(`✅ 创建了 ${users.length} 个用户`);

    console.log('📚 创建课程...');
    const courses = await Course.create(sampleData.courses);
    const course1 = courses[0];
    const course2 = courses[1];
    const course3 = courses[2];
    const course4 = courses[3];
    console.log(`✅ 创建了 ${courses.length} 门课程`);

    console.log('🏫 创建班级...');
    const class1 = await Class.create({
      ...sampleData.classes[0],
      courseId: course1._id,
      teacherIds: [teacher1._id],
      headTeacherId: teacher1._id,
      studentIds: [students[0]._id, students[1]._id]
    });

    const class2 = await Class.create({
      ...sampleData.classes[1],
      courseId: course1._id,
      teacherIds: [teacher1._id],
      headTeacherId: teacher1._id,
      studentIds: [students[2]._id, students[3]._id]
    });

    const class3 = await Class.create({
      ...sampleData.classes[2],
      courseId: course2._id,
      teacherIds: [teacher2._id],
      headTeacherId: teacher2._id,
      studentIds: [students[0]._id, students[2]._id, students[4]._id]
    });

    const class4 = await Class.create({
      ...sampleData.classes[3],
      courseId: course4._id,
      teacherIds: [teacher1._id, teacher2._id],
      headTeacherId: teacher1._id,
      studentIds: [students[1]._id, students[3]._id]
    });

    await Course.findByIdAndUpdate(course1._id, {
      teacherIds: [teacher1._id],
      classIds: [class1._id, class2._id]
    });

    await Course.findByIdAndUpdate(course2._id, {
      teacherIds: [teacher2._id],
      classIds: [class3._id]
    });

    await Course.findByIdAndUpdate(course4._id, {
      teacherIds: [teacher1._id, teacher2._id],
      classIds: [class4._id]
    });

    await User.findByIdAndUpdate(teacher1._id, {
      classIds: [class1._id, class2._id, class4._id]
    });

    await User.findByIdAndUpdate(teacher2._id, {
      classIds: [class3._id, class4._id]
    });

    await User.findByIdAndUpdate(students[0]._id, {
      classIds: [class1._id, class3._id]
    });

    await User.findByIdAndUpdate(students[1]._id, {
      classIds: [class1._id, class4._id]
    });

    await User.findByIdAndUpdate(students[2]._id, {
      classIds: [class2._id, class3._id]
    });

    await User.findByIdAndUpdate(students[3]._id, {
      classIds: [class2._id, class4._id]
    });

    await User.findByIdAndUpdate(students[4]._id, {
      classIds: [class3._id]
    });

    console.log('✅ 创建了 4 个班级');

    console.log('📝 创建作业...');
    await Homework.create({
      ...sampleData.homeworks[0],
      courseId: course1._id,
      classId: class1._id,
      createdBy: teacher1._id
    });

    await Homework.create({
      ...sampleData.homeworks[1],
      courseId: course1._id,
      classId: class1._id,
      createdBy: teacher1._id
    });

    await Homework.create({
      ...sampleData.homeworks[2],
      courseId: course2._id,
      classId: class3._id,
      createdBy: teacher2._id
    });

    await Homework.create({
      ...sampleData.homeworks[3],
      courseId: course1._id,
      classId: class2._id,
      createdBy: teacher1._id
    });

    await Homework.create({
      ...sampleData.homeworks[4],
      courseId: course2._id,
      classId: class3._id,
      createdBy: teacher2._id
    });

    console.log('✅ 创建了 5 个作业');

    console.log('\n🎉 数据初始化完成！');
    console.log('\n📋 测试账户：');
    console.log('   管理员：13800138001 / 123456');
    console.log('   李老师：13800138002 / 123456');
    console.log('   王老师：13800138003 / 123456');
    console.log('   学生小明：13800138004 / 123456');
    console.log('   学生小红：13800138005 / 123456');
    console.log('   学生小刚：13800138006 / 123456');
    console.log('   学生小美：13800138007 / 123456');
    console.log('   学生小华：13800138008 / 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ 数据初始化失败:', error.message);
    process.exit(1);
  }
};

initData();
