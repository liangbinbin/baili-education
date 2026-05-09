const sanitizeHtml = require('sanitize-html');

const isProduction = process.env.NODE_ENV === 'production';

const formatLog = (data) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...data
  };
  
  if (isProduction) {
    return JSON.stringify(logEntry);
  }
  
  const level = logEntry.level === 'error' ? '❌' : 
                logEntry.level === 'warn' ? '⚠️' : '📋';
  return `${level} [${logEntry.timestamp}] ${logEntry.method || ''} ${logEntry.path || ''} - ${logEntry.statusCode || ''} - ${logEntry.duration || ''}ms${logEntry.requestId ? ` [${logEntry.requestId}]` : ''}`;
};

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
    const logData = {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'
    };
    
    console.log(formatLog(logData));
  });

  next();
};

const logger = {
  info: (message, meta = {}) => {
    console.log(formatLog({ level: 'info', message, ...meta }));
  },
  warn: (message, meta = {}) => {
    console.warn(formatLog({ level: 'warn', message, ...meta }));
  },
  error: (message, meta = {}) => {
    console.error(formatLog({ level: 'error', message, ...meta }));
  },
  debug: (message, meta = {}) => {
    if (!isProduction) {
      console.log(formatLog({ level: 'debug', message, ...meta }));
    }
  }
};

module.exports = { sanitizeInput, validateObjectId, requestLogger, logger };
