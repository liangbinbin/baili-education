FROM node:18-alpine

LABEL maintainer="Baili Education"
LABEL description="百里口才教育系统后端服务（含前端）"

WORKDIR /app

COPY package*.json ./

RUN npm ci --production --registry=https://registry.npmmirror.com

COPY . .

RUN if [ -d "../frontend/student" ]; then \
    mkdir -p public/student public/teacher && \
    cp -r ../frontend/student/* public/student/ && \
    cp -r ../frontend/teacher/* public/teacher/; \
    fi && \
    mkdir -p public && \
    echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta nameviewport content="width=device-width,initial-scale=1"><title>百里教育</title><style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f5f5f5}.card{background:white;padding:40px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);text-align:center}a{display:block;margin:15px 0;padding:15px 30px;background:#667eea;color:white;text-decoration:none;border-radius:5px}a:hover{background:#764ba2}</style></head><body><div class=card><h1>🎓 百里教育管理系统</h1><a href=/student/index.html>📚 学员端</a><a href=/teacher/index.html>👨‍🏫 教师端</a></div></body></html>' > public/index.html; \
    mkdir -p /app/logs && chown -R node:node /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]
