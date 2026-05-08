const bcrypt = require('bcryptjs');
const { userService, courseService, classService, homeworkService } = require('../services');

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const sampleData = {
  users: [
    { phone: '13800138001', password: '123456', name: '张三', role: 'admin', gender: 'male', points: 0, isActive: true },
    { phone: '13800138002', password: '123456', name: '李老师', role: 'teacher', gender: 'female', points: 0, isActive: true },
    { phone: '13800138003', password: '123456', name: '王老师', role: 'teacher', gender: 'male', points: 0, isActive: true },
    { phone: '13800138004', password: '123456', name: '小明', role: 'student', gender: 'male', points: 150, isActive: true },
    { phone: '13800138005', password: '123456', name: '小红', role: 'student', gender: 'female', points: 200, isActive: true },
    { phone: '13800138006', password: '123456', name: '小刚', role: 'student', gender: 'male', points: 180, isActive: true },
    { phone: '13800138007', password: '123456', name: '小美', role: 'student', gender: 'female', points: 220, isActive: true },
    { phone: '13800138008', password: '123456', name: '小华', role: 'student', gender: 'male', points: 90, isActive: true }
  ],

  courses: [
    { name: '口才基础班', description: '培养孩子良好的语言表达能力', level: '入门', courseStatus: 'ongoing', courseType: 'main', courseTypeText: '主体系列课程', suitableGrade: ['grade1', 'grade2'] },
    { name: '演讲进阶班', description: '提升演讲技巧，培养领袖气质', level: '进阶', courseStatus: 'ongoing', courseType: 'main', courseTypeText: '主体系列课程', suitableGrade: ['grade3', 'grade4', 'grade5'] },
    { name: '主持特训营', description: '专业主持人培训课程', level: '高级', courseStatus: 'enrolling', courseType: 'elective', courseTypeText: '辅助选修课程', suitableGrade: ['grade4', 'grade5', 'grade6'] },
    { name: '朗诵艺术班', description: '感受语言之美，传承经典文化', level: '中级', courseStatus: 'ongoing', courseType: 'elective', courseTypeText: '辅助选修课程', suitableGrade: ['grade2', 'grade3', 'grade4'] }
  ],

  classes: [
    { name: '口才基础1班', classType: 'formal', classTypeText: '正式班', classStatus: 'ongoing', classStatusText: '正常', classroom: 'A1教室' },
    { name: '口才基础2班', classType: 'formal', classTypeText: '正式班', classStatus: 'ongoing', classStatusText: '正常', classroom: 'A2教室' },
    { name: '演讲进阶1班', classType: 'formal', classTypeText: '正式班', classStatus: 'ongoing', classStatusText: '正常', classroom: 'B1教室' },
    { name: '朗诵艺术班', classType: 'formal', classTypeText: '正式班', classStatus: 'active', classStatusText: '正常', classroom: 'C1教室' }
  ],

  homeworks: [
    { title: '自我介绍练习', content: '录制一段1分钟的自我介绍视频', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), points: 10, hasCheckin: false, isPublished: true },
    { title: '每日朗读打卡', content: '每天朗读一篇课文，录制音频提交', deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), points: 5, hasCheckin: true, checkinPoints: 5, sharePoints: 10, isPublished: true },
    { title: '故事演讲准备', content: '准备一个3分钟的故事演讲', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), points: 15, hasCheckin: false, isPublished: true },
    { title: '绕口令挑战', content: '练习绕口令并录制视频', deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), points: 8, hasCheckin: true, checkinPoints: 3, sharePoints: 5, isPublished: true },
    { title: '即兴演讲练习', content: '随机抽取题目进行1分钟即兴演讲', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), points: 12, hasCheckin: false, isPublished: true }
  ]
};

const initTestData = async () => {
  try {
    const existingUsers = await userService.find();
    if (existingUsers.length > 0) {
      console.log('✅ 测试数据已存在，跳过初始化');
      return;
    }

    console.log('🔄 初始化测试数据...');

    const encryptedUsers = await Promise.all(
      sampleData.users.map(async (u) => ({
        ...u,
        password: await encryptPassword(u.password)
      }))
    );
    const users = await Promise.all(encryptedUsers.map(u => userService.create(u)));
    const [admin, teacher1, teacher2, ...students] = users;

    const courses = await Promise.all(sampleData.courses.map(c => courseService.create(c)));
    const [course1, course2, course3, course4] = courses;

    const class1 = await classService.create({
      ...sampleData.classes[0],
      courseId: course1._id,
      teacherIds: [teacher1._id],
      headTeacherId: teacher1._id,
      studentIds: [students[0]._id, students[1]._id]
    });

    const class2 = await classService.create({
      ...sampleData.classes[1],
      courseId: course1._id,
      teacherIds: [teacher1._id],
      headTeacherId: teacher1._id,
      studentIds: [students[2]._id, students[3]._id]
    });

    const class3 = await classService.create({
      ...sampleData.classes[2],
      courseId: course2._id,
      teacherIds: [teacher2._id],
      headTeacherId: teacher2._id,
      studentIds: [students[0]._id, students[2]._id, students[4]._id]
    });

    const class4 = await classService.create({
      ...sampleData.classes[3],
      courseId: course4._id,
      teacherIds: [teacher1._id, teacher2._id],
      headTeacherId: teacher1._id,
      studentIds: [students[1]._id, students[3]._id]
    });

    await courseService.findByIdAndUpdate(course1._id, {
      teacherIds: [teacher1._id],
      classIds: [class1._id, class2._id]
    });

    await courseService.findByIdAndUpdate(course2._id, {
      teacherIds: [teacher2._id],
      classIds: [class3._id]
    });

    await homeworkService.create({ ...sampleData.homeworks[0], courseId: course1._id, classId: class1._id, createdBy: teacher1._id });
    await homeworkService.create({ ...sampleData.homeworks[1], courseId: course1._id, classId: class1._id, createdBy: teacher1._id });
    await homeworkService.create({ ...sampleData.homeworks[2], courseId: course2._id, classId: class3._id, createdBy: teacher2._id });
    await homeworkService.create({ ...sampleData.homeworks[3], courseId: course1._id, classId: class2._id, createdBy: teacher1._id });
    await homeworkService.create({ ...sampleData.homeworks[4], courseId: course2._id, classId: class3._id, createdBy: teacher2._id });

    console.log('✅ 测试数据初始化完成');
  } catch (error) {
    console.error('❌ 测试数据初始化失败:', error.message);
  }
};

module.exports = { initTestData };
