# 百里教学管理系统 - 开发规范

> 更新时间：2026-05-08  
> 版本：v1.0.0

---

## 一、代码风格规范

### 1.1 通用规范

- **缩进**：使用 2 个空格缩进
- **分号**：每条语句必须以分号结尾
- **引号**：优先使用单引号，字符串拼接时使用模板字符串
- **命名**：
  - 变量和函数：小驼峰（camelCase）
  - 常量：全大写下划线分隔（CONSTANT_NAME）
  - 类名：帕斯卡命名（PascalCase）
  - 文件名：小写中划线分隔（file-name.js）

### 1.2 后端代码规范

#### 1.2.1 目录结构
```
backend/
├── config/          # 配置目录
│   └── *.js        # 配置文件
├── controllers/     # 控制器目录
│   └── *Controller.js
├── middleware/      # 中间件目录
│   └── *.js
├── models/          # 数据模型目录
│   └── *.js
├── routes/          # 路由目录
│   └── *.js
├── services/       # 服务层目录
│   └── index.js
├── utils/          # 工具函数目录
│   └── *.js
└── server.js       # 入口文件
```

#### 1.2.2 路由定义规范
```javascript
// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

// 获取用户信息
router.get('/info', requireAuth, userController.getUserInfo);

// 更新用户信息
router.put('/info', requireAuth, userController.updateUserInfo);

module.exports = router;
```

#### 1.2.3 控制器规范
```javascript
// controllers/userController.js
const { catchAsync } = require('../middleware/errorHandler');

const getUserInfo = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await UserService.findById(userId);

  if (!user) {
    return res.error('用户不存在', 'NOT_FOUND', 404);
  }

  res.success(user);
});

module.exports = { getUserInfo };
```

#### 1.2.4 模型定义规范
```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^1[3-9]\d{9}$/
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 10
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
```

### 1.3 前端代码规范

#### 1.3.1 模块结构
```javascript
// app.js
(function() {
  'use strict';

  // 应用状态
  const AppState = {
    user: null,
    token: null,
    data: {}
  };

  // 初始化
  function init() {
    bindEvents();
    loadUserData();
  }

  // 事件绑定
  function bindEvents() {
    document.addEventListener('click', handleClick);
  }

  // 事件处理
  function handleClick(e) {
    const target = e.target;
    if (target.matches('.btn-submit')) {
      handleSubmit(target);
    }
  }

  // 初始化
  init();
})();
```

#### 1.3.2 XSS 防护规范
```javascript
// 输出到 HTML 内容
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

// 输出到 HTML 属性
function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

// 使用示例
element.innerHTML = escapeHtml(userInput);
element.setAttribute('data-id', escapeAttr(id));
```

---

## 二、Git 提交规范

### 2.1 分支管理

| 分支名称 | 说明 |
|---------|------|
| main | 主分支，保持稳定 |
| develop | 开发分支 |
| feature/* | 功能分支 |
| bugfix/* | 修复分支 |
| release/* | 发布分支 |

### 2.2 提交信息格式

```
<类型>(<范围>): <主题>

<body>

<footer>
```

#### 2.2.1 类型标识

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 bug |
| docs | 文档变更 |
| style | 代码格式（不影响功能） |
| refactor | 重构（不是修复也不是新功能） |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建或辅助工具变动 |

#### 2.2.2 提交示例

```
feat(auth): 添加用户登录功能

- 实现 JWT Token 认证
- 添加登录接口
- 添加注册接口

Closes #123
```

```
fix(checkin): 修复打卡积分计算错误

- 修复连续打卡天数计算问题
- 优化积分奖励逻辑

Closes #124
```

### 2.3 提交检查清单

- [ ] 代码符合编码规范
- [ ] 添加必要的注释
- [ ] 运行测试用例
- [ ] 更新相关文档
- [ ] 提交信息清晰明了

---

## 三、API 设计规范

### 3.1 URL 设计

```
基础URL: http://localhost:3000/api

资源命名：
- 使用名词复数形式：/users, /courses, /homeworks
- 使用中划线分隔：/check-in-records
- 嵌套资源：/homeworks/:id/submissions

HTTP 方法：
- GET：查询
- POST：创建
- PUT：更新
- DELETE：删除
```

### 3.2 请求规范

```javascript
// 请求头
Content-Type: application/json
Authorization: Bearer {token}

// 查询参数
GET /api/homework/list?courseId=xxx&page=1&limit=20

// 请求体
POST /api/homework/submit
{
  "homeworkId": "xxx",
  "files": [...]
}
```

### 3.3 响应规范

```javascript
// 成功响应
{
  "code": 200,
  "success": true,
  "message": "操作成功",
  "data": { ... }
}

// 分页响应
{
  "code": 200,
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}

// 错误响应
{
  "code": 400,
  "success": false,
  "errorCode": "VALIDATION_ERROR",
  "message": "参数验证失败",
  "details": [...]
}
```

### 3.4 状态码规范

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |

---

## 四、安全规范

### 4.1 认证与授权

- 所有敏感接口必须认证
- 使用 HTTPS 传输
- Token 设置有效期
- 敏感操作需二次验证

### 4.2 输入验证

- 服务端必须验证所有输入
- 使用 express-validator 进行验证
- 限制输入长度和格式
- 防止 SQL 注入和 XSS

### 4.3 速率限制

| 接口类型 | 限制 | 窗口 |
|---------|------|------|
| 认证接口 | 20次 | 15分钟 |
| 通用API | 100次 | 1分钟 |

### 4.4 数据安全

- 密码必须加密存储
- 敏感数据脱敏处理
- 日志不记录敏感信息
- 定期更新依赖版本

---

## 五、测试规范

### 5.1 测试覆盖

- 单元测试：核心业务逻辑
- 集成测试：API 接口
- E2E 测试：关键用户流程

### 5.2 测试用例命名

```
describe('UserController', () => {
  describe('getUserInfo', () => {
    it('应该返回当前用户信息', () => {});
    it('未登录时应返回401错误', () => {});
  });
});
```

---

## 六、文档规范

### 6.1 代码注释

- 公共函数必须添加 JSDoc 注释
- 复杂逻辑添加行内注释
- 更新代码时同步更新注释

### 6.2 文档维护

- API 变更时更新 API_DOC.md
- 重大功能更新时更新 DEV_PROGRESS.md
- 安全漏洞及时更新安全规范

---

## 七、环境配置

### 7.1 环境变量

```bash
# .env.example
NODE_ENV=development
PORT=3000

# 数据库
MONGODB_URI=mongodb://localhost:27017/baili
USE_MEMORY_DB=false

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 速率限制
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### 7.2 环境切换

| 环境 | USE_MEMORY_DB | 说明 |
|------|---------------|------|
| development | true | 使用内存数据库 |
| production | false | 使用 MongoDB |

---

## 八、版本规范

### 8.1 版本号格式

```
主版本.次版本.修订号

- 主版本：不兼容的重大变更
- 次版本：向后兼容的功能新增
- 修订号：向后兼容的问题修复
```

### 8.2 更新日志

```markdown
## [1.0.0] - 2026-05-08

### Added
- 用户认证功能
- 作业管理功能
- 打卡功能
- 积分系统

### Changed
- 优化数据库查询性能
- 重构响应中间件

### Fixed
- 修复打卡统计错误
- 修复积分计算问题
```

---

## 九、术语表

| 术语 | 说明 |
|------|------|
| JWT | JSON Web Token，身份认证令牌 |
| API | 应用程序编程接口 |
| CRUD | Create/Read/Update/Delete，增删改查 |
| XSS | 跨站脚本攻击 |
| CSRF | 跨站请求伪造 |
| ORM | 对象关系映射 |
| MVC | Model-View-Controller，模型视图控制器 |

---

## 十、联系与支持

如有问题，请查阅以下文档：

- [需求文档](./requirements-v2.0.md)
- [API文档](./backend/API_DOC.md)
- [开发进度](./DEV_PROGRESS.md)

---

*本规范会随项目发展持续更新。*
