const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.error(400, 'VALIDATION_ERROR', '数据验证失败', errors);
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.error(400, 'INVALID_ID', '无效的ID格式');
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.error(400, 'DUPLICATE_ERROR', `${field}已存在`);
  }

  if (err.name === 'JsonWebTokenError') {
    return res.error(401, 'TOKEN_INVALID', 'Token无效');
  }

  if (err.name === 'TokenExpiredError') {
    return res.error(401, 'TOKEN_EXPIRED', 'Token已过期');
  }

  if (err.status === 404) {
    return res.error(404, 'NOT_FOUND', err.message || '资源不存在');
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || '服务器内部错误';

  res.error(statusCode, err.errorCode || 'INTERNAL_ERROR', message);
};

class AppError extends Error {
  constructor(message, statusCode = 400, errorCode = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };
