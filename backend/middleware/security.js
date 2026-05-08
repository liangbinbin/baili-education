const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return sanitizeHtml(obj, {
        allowedTags: [],
        allowedAttributes: {}
      });
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => sanitize(item));
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

const validateObjectId = (req, res, next) => {
  const objectIdPattern = /^[a-fA-F0-9]{24}$/;
  
  const checkId = (id) => {
    if (id && typeof id === 'string' && !objectIdPattern.test(id)) {
      return false;
    }
    return true;
  };

  if (req.params.id && !checkId(req.params.id)) {
    return res.error(400, 'INVALID_ID', '无效的ID格式');
  }

  next();
};

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📋 ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = { sanitizeInput, validateObjectId, requestLogger };
