# 百里教育管理系统 - Railway 部署指南

## 概述

本指南将帮助您将百里教育管理系统部署到 Railway 平台，实现公网访问。

Railway 提供免费的 Hobby 计划，包含：
- 500小时/月 运行时间
- 共享 CPU
- 1GB RAM
- 100GB 磁盘

## 部署步骤

### 1. 准备 MongoDB Atlas

Railway 不提供免费 MongoDB，需要使用 MongoDB Atlas 云数据库：

1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas) 注册账号
2. 创建免费 M0 集群：
   - 选择区域：aws-singapore（延迟最低）
   - 选择层级：M0 Sandbox（免费）
3. 配置网络访问：
   - 进入 Security → Network Access
   - 点击 "Add IP Address"
   - 选择 "Allow Access from Anywhere" (0.0.0.0/0)
4. 创建数据库用户：
   - 进入 Security → Database Access
   - 点击 "Add New Database User"
   - 设置用户名和密码（记住这两个值）
5. 获取连接字符串：
   - 进入 Clusters → Connect
   - 选择 "Connect your application"
   - 复制连接字符串，格式如下：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/baili_education?retryWrites=true&w=majority
   ```

### 2. 部署到 Railway

**方式一：通过 GitHub 部署（推荐）**

1. 将代码推送到 GitHub 仓库
2. 访问 [Railway](https://railway.app) 并登录（推荐使用 GitHub 登录）
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择您的仓库
5. Railway 会自动检测 Node.js 项目

**方式二：上传 ZIP**

1. 在项目根目录执行：
   ```bash
   cd /workspace
   zip -r baili-education.zip backend/ -x "backend/node_modules/*" -x "backend/.git/*"
   ```
2. 在 Railway 点击 "New Project" → "Upload a ZIP"

### 3. 配置环境变量

在 Railway 项目中，点击 "Variables" 选项卡，添加以下变量：

```
NODE_ENV = production
PORT = 3000
STANDALONE_MODE = true
DB_MODE = mongodb
MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/baili_education?retryWrites=true&w=majority
JWT_SECRET = <生成一个随机的强密码>
JWT_EXPIRES_IN = 7d
CORS_ORIGIN = *
```

**生成 JWT_SECRET 的方法**：
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. 部署配置

确保项目根目录有以下文件：

**railway.json**（已创建）：
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "nixpacksJson": {
      "pkgs": ["nodejs_20"]
    }
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "runtime": "Node.js",
    "nodeVersion": "20"
  }
}
```

### 5. 触发部署

1. Railway 会自动开始构建
2. 查看构建日志：
   - 点击 "Deployments" 标签
   - 查看实时日志
3. 等待构建完成（约2-3分钟）

### 6. 配置域名（可选）

1. 部署成功后，点击 "Settings" → "Networking"
2. 点击 "Generate Domain"
3. Railway 会生成一个免费域名，格式如：`baili-education.up.railway.app`
4. 使用此域名即可公网访问

## 访问系统

部署成功后，访问以下地址：

- 入口页：`https://<your-domain>.up.railway.app`
- 学员端：`https://<your-domain>.up.railway.app/student/index.html`
- 教师端：`https://<your-domain>.up.railway.app/teacher/index.html`
- API：`https://<your-domain>.up.railway.app/api`

## 测试账号

| 角色 | 手机号 | 密码 |
|------|--------|------|
| 管理员 | 13800138001 | 123456 |
| 教师 | 13800138002 | 123456 |
| 学生 | 13800138004 | 123456 |

> 注意：首次部署后，访问任意页面会自动初始化测试数据。

## 故障排查

### 1. 构建失败

检查日志中的错误信息，常见问题：
- 依赖安装失败：检查 package.json
- Node 版本问题：确保使用 Node 18+

### 2. 启动失败

检查环境变量：
- MONGODB_URI 格式是否正确
- JWT_SECRET 是否已设置

### 3. 数据库连接失败

1. 确认 MongoDB Atlas 网络访问允许所有 IP
2. 确认用户名密码正确
3. 检查集群状态是否正常

### 4. CORS 错误

如果前端调用 API 失败，检查：
- CORS_ORIGIN 设置为 `*` 或具体域名
- 确保 API_BASE 配置正确

## 更新部署

修改代码后，只需推送到 GitHub，Railway 会自动重新部署。

## 费用说明

- Railway Hobby 计划：免费
- MongoDB Atlas M0：免费
- 总费用：$0/月

## 后续优化建议

1. 配置自定义域名
2. 启用 HTTPS
3. 设置环境变量的加密存储
4. 配置告警通知
