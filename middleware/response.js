const responseMiddleware = (req, res, next) => {
  res.success = (data = null, message = '操作成功') => {
    res.json({
      code: 200,
      success: true,
      message,
      data
    });
  };

  res.error = (code = 400, errorCode = 'ERROR', message = '操作失败', details = null) => {
    const response = {
      code,
      success: false,
      errorCode,
      message
    };
    
    if (details) {
      response.details = details;
    }
    
    res.status(code).json(response);
  };

  res.paginated = (data, pagination, message = '获取成功') => {
    res.json({
      code: 200,
      success: true,
      message,
      data,
      pagination
    });
  };

  next();
};

module.exports = responseMiddleware;
