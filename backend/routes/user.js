const express = require('express');
const { body } = require('express-validator');
const { userService } = require('../services');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/info', protect, async (req, res) => {
  const user = await userService.findById(req.userId);
  
  res.success({
    id: user._id,
    phone: user.phone,
    name: user.name,
    avatar: user.avatar,
    gender: user.gender,
    birthday: user.birthday,
    role: user.role,
    points: user.points || 0,
    classIds: user.classIds || [],
    openid: user.openid
  });
});

router.put('/info',
  protect,
  validate([
    body('name').optional().trim().isLength({ min: 2, max: 10 }).withMessage('姓名2-10个字符'),
    body('avatar').optional().isURL().withMessage('头像必须是有效URL'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('性别选择无效'),
    body('birthday').optional().isISO8601().withMessage('生日格式无效')
  ]),
  async (req, res, next) => {
    try {
      const { name, avatar, gender, birthday } = req.body;
      
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (gender !== undefined) updateData.gender = gender;
      if (birthday !== undefined) updateData.birthday = birthday;

      const user = await userService.findByIdAndUpdate(req.userId, updateData);

      res.success({
        id: user._id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        gender: user.gender,
        birthday: user.birthday,
        role: user.role,
        points: user.points || 0
      }, '更新成功');
    } catch (error) {
      next(error);
    }
  }
);

router.get('/debug', async (req, res) => {
  const users = await userService.find();
  res.success({
    count: users.length,
    users: users.map(u => ({
      phone: u.phone,
      name: u.name,
      role: u.role,
      passwordLength: u.password.length,
      passwordEncrypted: u.password.startsWith('$2a$')
    }))
  });
});

router.get('/debug/password', async (req, res) => {
  const { phone, password } = req.query;
  const user = await userService.findOne({ phone });
  
  if (!user) {
    return res.success({ found: false, message: '用户不存在' });
  }
  
  const match = await userService.comparePassword(password, user.password);
  res.success({
    found: true,
    phone: user.phone,
    passwordLength: user.password.length,
    passwordEncrypted: user.password.startsWith('$2a$'),
    passwordMatch: match
  });
});

module.exports = router;
