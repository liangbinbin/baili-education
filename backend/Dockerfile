FROM node:18-alpine

LABEL maintainer="Baili Education"
LABEL description="百里口才教育系统后端服务"

WORKDIR /app

COPY package*.json ./

RUN npm ci --production --registry=https://registry.npmmirror.com

COPY . .

RUN mkdir -p /app/logs && chown -R node:node /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]
