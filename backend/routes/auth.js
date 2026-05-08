const express = require('express');
const { body } = require('express-validator');
const { userService } = require('../services');
const { generateToken } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

router.post('/test-login',
  validate([
    body('phone').matches(/^1[3-9]\d{9}$/).withMessage('请输入正确的手机号'),
    body('name').trim().isLength({ min: 2, max: 10 }).withMessage('姓名2-10个字符')
  ]),
  async (req, res, next) => {
    try {
      const { phone, name, role = 'student' } = req.body;

      let user = await userService.findOne({ phone });

      if (!user) {
        user = await userService.create({
          phone,
          name,
          password: '123456',
          role
        });
      } else {
        user.name = name;
        user.lastLoginAt = new Date();
      }

      const token = generateToken(user._id);

      res.success({
        token,
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          points: user.points || 0,
          gender: user.gender,
          birthday: user.birthday,
          classIds: user.classIds || []
        }
      }, '登录成功');
    } catch (error) {
      next(error);
    }
  }
);

router.post('/register',
  validate([
    body('phone').matches(/^1[3-9]\d{9}$/).withMessage('请输入正确的手机号'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6位'),
    body('name').trim().isLength({ min: 2, max: 10 }).withMessage('姓名2-10个字符')
  ]),
  async (req, res, next) => {
    try {
      const { phone, password, name, role = 'student' } = req.body;

      const existingUser = await userService.findOne({ phone });
      if (existingUser) {
        throw new AppError('该手机号已注册', 400, 'PHONE_EXISTS');
      }

      const user = await userService.create({
        phone,
        password,
        name,
        role
      });

      const token = generateToken(user._id);

      res.success({
        token,
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role
        }
      }, '注册成功');
    } catch (error) {
      next(error);
    }
  }
);

router.post('/login',
  validate([
    body('phone').matches(/^1[3-9]\d{9}$/).withMessage('请输入正确的手机号'),
    body('password').isLength({ min: 6, max: 50 }).withMessage('密码至少6位')
  ]),
  async (req, res, next) => {
    try {
      const { phone, password } = req.body;

      const user = await userService.findOne({ phone });
      if (!user) {
        throw new AppError('手机号或密码错误', 401, 'AUTH_FAILED');
      }

      if (!user.isActive) {
        throw new AppError('账号已被禁用', 401, 'ACCOUNT_DISABLED');
      }

      const isPasswordValid = await userService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('手机号或密码错误', 401, 'AUTH_FAILED');
      }

      await userService.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

      const token = generateToken(user._id);

      res.success({
        token,
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          points: user.points || 0
        }
      }, '登录成功');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
