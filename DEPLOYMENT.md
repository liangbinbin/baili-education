# 百里教学管理系统 - 生产环境部署指南

> 版本: v1.0.0  
> 更新日期: 2026-05-08

---

## 一、部署前检查清单

### 1.1 环境配置

```bash
# 1. 复制环境变量文件
cp backend/.env.example backend/.env

# 2. 编辑 backend/.env，设置以下配置:
```

| 配置项 | 说明 | 必须 |
|--------|------|------|
| NODE_ENV | 必须设置为 `production` | ✅ |
| PORT | 端口号，默认 3000 | ✅ |
| MONGODB_URI | MongoDB 连接地址 | ✅ |
| MONGODB_USER | MongoDB 用户名 | ✅ |
| MONGODB_PASSWORD | MongoDB 密码 | ✅ |
| JWT_SECRET | JWT密钥（必须重新生成） | ✅ |
| JWT_EXPIRES_IN | Token过期时间，建议 `1h` | ✅ |
| CORS_ORIGIN | 前端域名 | ✅ |

### 1.2 生成安全密钥

```bash
# 生成强JWT密钥（至少32字符）
openssl rand -hex 32

# 或使用以下命令生成
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.3 MongoDB 配置

```bash
# MongoDB 连接字符串格式
mongodb://username:password@host:port/database?authSource=admin

# 示例
mongodb://baili_user:your_password@localhost:27017/baili_education?authSource=admin
```

### 1.4 Nginx 配置

参考 [nginx/nginx.conf](nginx/nginx.conf) 文件，配置反向代理和静态文件服务。

---

## 二、部署方式

### 2.1 PM2 部署（推荐）

```bash
# 1. 进入后端目录
cd backend

# 2. 安装依赖
npm install

# 3. 构建（如果有）
npm run build

# 4. 启动服务（开发模式）
npm start

# 或使用 PM2（生产模式）
npm install -g pm2
pm2 start ecosystem.config.js --env production

# 5. 保存 PM2 配置
pm2 save

# 6. 设置开机自启
pm2 startup
```

### 2.2 Docker 部署

```bash
# 1. 复制环境变量模板
cp .env.docker .env
# 编辑 .env 设置真实配置

# 2. 构建并启动
docker-compose up -d

# 3. 查看日志
docker-compose logs -f

# 4. 停止服务
docker-compose down
```

### 2.3 Kubernetes 部署

```bash
# 1. 配置密钥
kubectl apply -f k8s/secrets.yaml

# 2. 部署应用
kubectl apply -f k8s/deployment.yaml

# 3. 查看状态
kubectl get pods -w
```

---

## 三、数据迁移

### 3.1 从内存数据库迁移

如果当前使用内存数据库模式，需要迁移到 MongoDB：

```bash
# 1. 启动 MongoDB 服务

# 2. 完整迁移（备份+恢复）
node backend/scripts/migrate.js full

# 或分步执行
node backend/scripts/migrate.js backup    # 备份到 backups/
node backend/scripts/migrate.js restore  # 从备份恢复
```

### 3.2 初始化生产数据

```bash
# 初始化基础数据（可选）
node backend/scripts/initData.js
```

---

## 四、健康检查

### 4.1 API 健康检查

```bash
# 存活探针
curl http://localhost:3000/health/live

# 就绪探针
curl http://localhost:3000/health/ready

# 详细健康信息
curl http://localhost:3000/api/health
```

### 4.2 预期响应

```json
{
  "code": 200,
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-05-08T10:00:00.000Z",
    "uptime": 3600,
    "version": "1.0.0",
    "database": "connected"
  }
}
```

---

## 五、日志管理

### 5.1 日志位置

| 环境 | 日志文件 |
|------|----------|
| 开发环境 | 控制台输出 |
| 生产环境 | `backend/logs/combined.log` |

### 5.2 日志级别

通过环境变量 `LOG_LEVEL` 设置：
- `debug` - 详细调试信息
- `info` - 一般信息（默认）
- `warn` - 警告信息
- `error` - 错误信息

---

## 六、监控与告警

### 6.1 性能指标

监控以下指标：
- CPU 使用率
- 内存使用率
- 响应时间
- 请求成功率
- 错误率

### 6.2 告警阈值建议

| 指标 | 警告 | 严重 |
|------|------|------|
| CPU | > 70% | > 90% |
| 内存 | > 80% | > 95% |
| 响应时间 | > 1s | > 3s |
| 错误率 | > 1% | > 5% |

---

## 七、故障排查

### 7.1 服务无法启动

```bash
# 检查端口占用
lsof -i :3000

# 检查环境变量
echo $NODE_ENV
echo $JWT_SECRET

# 查看详细错误日志
pm2 logs baili-backend --err
```

### 7.2 数据库连接失败

```bash
# 测试 MongoDB 连接
mongosh "mongodb://localhost:27017/baili_education" --eval "db.adminCommand('ping')"

# 检查连接超时配置
export MONGO_SERVER_SELECTION_TIMEOUT=10000
```

### 7.3 内存泄漏

```bash
# PM2 监控内存使用
pm2 monit

# 设置内存限制自动重启
pm2 restart baili-backend --max-memory-restart 384M
```

---

## 八、安全加固

### 8.1 必做项

- [ ] 修改 JWT_SECRET 为强密钥
- [ ] 配置正确的 CORS_ORIGIN
- [ ] 启用 HTTPS
- [ ] 配置防火墙规则
- [ ] 启用日志记录

### 8.2 建议项

- [ ] 配置 Redis 缓存
- [ ] 添加 IP 白名单
- [ ] 配置备份策略
- [ ] 添加请求限流
- [ ] 启用 API 版本控制

---

## 九、回滚方案

### 9.1 PM2 回滚

```bash
# 查看历史版本
pm2 show baili-backend

# 回滚到指定版本
pm2 restart baili-backend --node-args="--version=X.X.X"
```

### 9.2 Docker 回滚

```bash
# 查看镜像历史
docker images baili-education/backend

# 回滚到指定版本
docker-compose down
docker-compose pull
docker-compose up -d
```

---

## 十、联系与支持

如有问题，请查阅：
- [API文档](../backend/API_DOC.md)
- [开发规范](../DEV_STANDARDS.md)
- [开发进度](../DEV_PROGRESS.md)
