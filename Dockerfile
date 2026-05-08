# ==========================================
# 百里教育管理系统 - Dockerfile
# ==========================================

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

FROM node:18-alpine

LABEL maintainer="Baili Education"
LABEL description="Baili Education Management System Backend"

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

COPY backend/ ./backend/
COPY frontend/ ./frontend/

ENV NODE_ENV=production
ENV PORT=3000
ENV GRACEFUL_SHUTDOWN_TIMEOUT=30000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health/live || exit 1

USER node

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "backend/server.js"]
