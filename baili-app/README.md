# 百里口才 Uni-app 项目

这是一个基于 Uni-app + Vue 3 + Pinia 的青少儿口才教育平台。

## 项目结构

```
baili-app/
├── src/
│   ├── pages/                  # 页面
│   │   ├── login/              # 登录模块
│   │   ├── student/            # 学员端
│   │   └── teacher/            # 教师端
│   ├── components/             # 组件
│   │   ├── common/             # 通用组件
│   │   └── business/           # 业务组件
│   ├── store/                  # Pinia 状态管理
│   ├── api/                    # API 接口
│   ├── utils/                  # 工具函数
│   ├── styles/                 # 全局样式
│   ├── App.vue                 # 应用入口
│   ├── main.js                 # 主文件
│   ├── manifest.json           # 应用配置
│   └── pages.json              # 页面路由配置
├── index.html
├── vite.config.js
└── package.json
```

## 功能模块

### 学员端
- 首页（快捷导航、任务概览）
- 课程列表/详情
- 班级列表/详情
- 任务列表/详情/提交/记录
- 积分中心
- 排行榜
- 个人中心

### 教师端
- 首页（数据统计、快捷操作）
- 课程管理（只读）
- 班级管理（只读）
- 任务管理（发布、批改）
- 排课管理
- 积分管理
- 个人中心

## 技术栈

- Uni-app
- Vue 3 (Composition API + `<script setup>`)
- Pinia
- SCSS
- Vite

## 设计规范

### 色彩体系
- 品牌主色：橙色 (#FF6B35)
- 打卡强调色：红色渐变 (#FF6B6B → #EE5A24)
- 功能色：成功(#52C41A)、警告(#FAAD14)、错误(#FF4D4F)、信息(#1890FF)

### 圆角系统
- 卡片：24px
- 按钮：16px
- 标签：20px

### 间距系统
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- xxl: 24px

## 开发命令

```bash
# 安装依赖
npm install

# 微信小程序开发
npm run dev:mp-weixin

# H5 开发
npm run dev:h5

# 微信小程序打包
npm run build:mp-weixin

# H5 打包
npm run build:h5
```

## 项目特点

✅ 完整的项目结构
✅ 统一的设计系统
✅ 组件化开发
✅ Pinia 状态管理
✅ 统一的 API 封装
✅ 学员端 + 教师端双端实现
