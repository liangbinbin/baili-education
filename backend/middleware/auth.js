const jwt = require('jsonwebtoken');
const config = require('../config/app');
const { userService } = require('../services');
const { AppError } = require('./errorHandler');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('请先登录', 401, 'NOT_LOGGED_IN');
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await userService.findById(decoded.id);
    if (!user) {
      throw new AppError('用户不存在', 401, 'USER_NOT_FOUND');
    }

    if (!user.isActive) {
      throw new AppError('账号已被禁用', 401, 'ACCOUNT_DISABLED');
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.error(401, 'TOKEN_INVALID', 'Token无效');
    }
    if (error.name === 'TokenExpiredError') {
      return res.error(401, 'TOKEN_EXPIRED', 'Token已过期，请重新登录');
    }
    next(error);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.error(403, 'FORBIDDEN', '您没有权限执行此操作');
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await userService.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

module.exports = {
  protect,
  restrictTo,
  optionalAuth,
  generateToken
};
