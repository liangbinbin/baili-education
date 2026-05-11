# 百里口才后台管理系统

## 项目介绍

百里口才后台管理系统是一个基于 Vue 3 + Element Plus + Pinia + Vite 构建的现代化后台管理应用。

## 技术栈

- Vue 3 (Composition API)
- Vite 5
- Element Plus
- Pinia
- Vue Router 4
- SCSS

## 功能模块

### 1. 仪表盘 (Dashboard)
- 数据统计卡片（学员、教师、课程、班级）
- 近期任务列表
- 快捷操作区域

### 2. 学员管理
- 学员列表展示
- 学员新增/编辑/删除
- 积分信息展示

### 3. 教师管理
- 教师列表展示
- 教师新增/编辑/删除
- 教授课程和学员数统计

### 4. 课程管理
- 课程列表展示
- 课程新增/编辑/删除
- 课程价格和课时管理

### 5. 班级管理
- 班级列表展示
- 班级新增/编辑/删除
- 班级学员数统计

### 6. 排课管理
- 班级排课（周视图）
- 教师课表查询
- 排课添加/编辑/删除

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 项目结构

```
baili-admin/
├── src/
│   ├── views/           # 页面组件
│   │   ├── student/     # 学员管理
│   │   ├── teacher/     # 教师管理
│   │   ├── course/      # 课程管理
│   │   ├── class/       # 班级管理
│   │   ├── schedule/    # 排课管理
│   │   ├── Dashboard.vue
│   │   └── Login.vue
│   ├── layout/          # 布局组件
│   ├── router/          # 路由配置
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

## 默认账号

- 用户名: admin
- 密码: 123456

## 开发说明

### 路由配置
路由配置位于 `src/router/index.js`，采用懒加载方式按需加载页面组件。

### 状态管理
使用 Pinia 进行状态管理。

### UI 组件库
使用 Element Plus 作为 UI 组件库，已在 main.js 中全局注册。

### 样式规范
- 使用 SCSS 预处理器
- 颜色使用主题色 #FF6B35（橙色）
- 遵循响应式设计原则

## 相关项目

- [百里口才学员端](../baili-app)
- [后端 API](../)
