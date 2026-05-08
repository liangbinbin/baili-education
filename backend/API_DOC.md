# 百里教学管理系统 API 文档

> 版本: v1.0.0  
> 更新日期: 2026-05-08  
> 基础URL: `http://localhost:3000/api`

---

## 目录

1. [概述](#概述)
2. [认证与授权](#认证与授权)
3. [用户模块](#用户模块)
4. [课程模块](#课程模块)
5. [班级模块](#班级模块)
6. [作业模块](#作业模块)
7. [打卡模块](#打卡模块)
8. [积分模块](#积分模块)
9. [批量接口](#批量接口)
10. [错误码](#错误码)

---

## 概述

### 基础信息

| 项目 | 说明 |
|------|------|
| 基础URL | `http://localhost:3000/api` |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 认证方式 | Bearer Token (JWT) |

### 统一响应格式

所有API响应均采用以下统一格式：

**成功响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

**分页响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "获取成功",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

**错误响应：**
```json
{
  "code": 400,
  "success": false,
  "errorCode": "VALIDATION_ERROR",
  "message": "参数验证失败",
  "details": [...]
}
```

---

## 认证与授权

### 1. 测试登录（开发环境）

快速登录，自动创建用户或更新用户信息。

**请求：**
```
POST /api/auth/test-login
Content-Type: application/json
```

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | ✅ | 手机号（11位数字） |
| name | string | ✅ | 姓名（2-10个字符） |
| role | string | ❌ | 角色（student/teacher/admin，默认student） |

**示例：**
```json
{
  "phone": "13800138004",
  "name": "小明",
  "role": "student"
}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "user_xxx",
      "phone": "13800138004",
      "name": "小明",
      "role": "student",
      "avatar": null,
      "points": 150,
      "gender": "male",
      "birthday": null,
      "classIds": []
    }
  }
}
```

---

### 2. 用户注册

注册新用户账号。

**请求：**
```
POST /api/auth/register
Content-Type: application/json
```

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | ✅ | 手机号（11位数字） |
| password | string | ✅ | 密码（6-20位，需包含大小写字母和数字） |
| name | string | ✅ | 姓名（2-10个字符） |
| role | string | ❌ | 角色（默认student） |

**示例：**
```json
{
  "phone": "13800138004",
  "password": "Password123",
  "name": "小明",
  "role": "student"
}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "user_xxx",
      "phone": "13800138004",
      "name": "小明",
      "role": "student"
    }
  }
}
```

---

### 3. 用户登录

正式登录接口。

**请求：**
```
POST /api/auth/login
Content-Type: application/json
```

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | ✅ | 手机号 |
| password | string | ✅ | 密码 |

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "user_xxx",
      "phone": "13800138004",
      "name": "小明",
      "role": "student",
      "avatar": null,
      "points": 150
    }
  }
}
```

---

## 用户模块

### 4. 获取当前用户信息

获取登录用户的详细信息。

**请求：**
```
GET /api/user/info
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "id": "user_xxx",
    "phone": "13800138004",
    "name": "小明",
    "avatar": null,
    "gender": "male",
    "birthday": null,
    "role": "student",
    "points": 150,
    "classIds": [],
    "openid": null
  }
}
```

---

### 5. 更新用户信息

更新当前用户的个人信息。

**请求：**
```
PUT /api/user/info
Authorization: Bearer {token}
Content-Type: application/json
```

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | ❌ | 姓名（2-10个字符） |
| avatar | string | ❌ | 头像URL |
| gender | string | ❌ | 性别（male/female/other） |
| birthday | string | ❌ | 生日（ISO8601格式） |

**示例：**
```json
{
  "name": "小明同学",
  "avatar": "https://example.com/avatar.jpg",
  "gender": "male"
}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "更新成功",
  "data": {
    "id": "user_xxx",
    "phone": "13800138004",
    "name": "小明同学",
    "avatar": "https://example.com/avatar.jpg",
    "gender": "male",
    "role": "student",
    "points": 150
  }
}
```

---

## 课程模块

### 6. 获取课程列表

获取所有课程列表。

**请求：**
```
GET /api/course/list
Authorization: Bearer {token}
```

**查询参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | string | ❌ | 课程状态（enrolling/ongoing/paused/ended） |
| type | string | ❌ | 课程类型（main/elective/other） |

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": [
    {
      "_id": "course_xxx",
      "name": "口才基础班",
      "description": "培养孩子良好的语言表达能力",
      "level": "入门",
      "courseStatus": "ongoing",
      "courseType": "main",
      "courseTypeText": "主体系列课程",
      "suitableGrade": ["grade1", "grade2"],
      "courseIntro": "通过有趣的故事和游戏..."
    }
  ]
}
```

---

### 7. 获取课程详情

获取指定课程的详细信息。

**请求：**
```
GET /api/course/{id}
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "_id": "course_xxx",
    "name": "口才基础班",
    "description": "培养孩子良好的语言表达能力",
    "level": "入门",
    "courseStatus": "ongoing",
    "courseType": "main",
    "courseTypeText": "主体系列课程",
    "teacherIds": [],
    "classIds": [],
    "sections": [],
    "coverImage": null,
    "courseDetail": "..."
  }
}
```

---

## 班级模块

### 8. 获取班级列表

获取所有班级列表。

**请求：**
```
GET /api/class/list
Authorization: Bearer {token}
```

**查询参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| courseId | string | ❌ | 课程ID |
| status | string | ❌ | 班级状态（active/ongoing/paused/ended） |

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": [
    {
      "_id": "class_xxx",
      "name": "口才基础1班",
      "courseId": {
        "_id": "course_xxx",
        "name": "口才基础班"
      },
      "studentCount": 15,
      "classStatus": "ongoing",
      "classStatusText": "正常",
      "classroom": "A1教室",
      "teacherIds": [],
      "headTeacherId": null,
      "studentIds": []
    }
  ]
}
```

---

## 作业模块

### 9. 获取作业列表

获取当前用户的作业列表。

**请求：**
```
GET /api/homework/list
Authorization: Bearer {token}
```

**查询参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| courseId | string | ❌ | 课程ID |
| classId | string | ❌ | 班级ID |
| hasCheckin | boolean | ❌ | 是否打卡作业 |

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": [
    {
      "_id": "homework_xxx",
      "title": "自我介绍练习",
      "content": "录制一段1分钟的自我介绍视频",
      "deadline": "2026-05-15T00:00:00.000Z",
      "points": 10,
      "hasCheckin": false,
      "courseId": {
        "_id": "course_xxx",
        "name": "口才基础班"
      },
      "classId": {
        "_id": "class_xxx",
        "name": "口才基础1班"
      },
      "cycle": {
        "type": "single",
        "durationDays": 1
      },
      "frequency": {
        "timesPerCycle": 1
      },
      "totalTasksCount": 1,
      "completedTimes": 0,
      "completedCycles": 0,
      "isCompleted": false
    }
  ]
}
```

---

### 10. 获取作业详情

获取指定作业的详细信息和提交记录。

**请求：**
```
GET /api/homework/{id}
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "homework": {
      "_id": "homework_xxx",
      "title": "自我介绍练习",
      "content": "录制一段1分钟的自我介绍视频",
      "deadline": "2026-05-15T00:00:00.000Z",
      "points": 10,
      "hasCheckin": false
    },
    "submissions": [],
    "progress": {
      "total": 1,
      "completed": 0,
      "percentage": 0
    }
  }
}
```

---

### 11. 提交作业

提交作业完成记录。

**请求：**
```
POST /api/homework/submit
Authorization: Bearer {token}
Content-Type: application/json
```

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| homeworkId | string | ✅ | 作业ID |
| cycleIndex | number | ❌ | 周期索引（默认0） |
| timeIndex | number | ❌ | 次数索引（默认0） |
| files | array | ❌ | 上传文件列表 |
| files[].type | string | ✅ | 文件类型（image/audio/video） |
| files[].url | string | ✅ | 文件URL |
| files[].filename | string | ✅ | 文件名 |
| files[].size | number | ✅ | 文件大小 |
| comment | string | ❌ | 备注 |

**示例：**
```json
{
  "homeworkId": "homework_xxx",
  "cycleIndex": 0,
  "timeIndex": 0,
  "files": [
    {
      "type": "video",
      "url": "https://example.com/video.mp4",
      "filename": "自我介绍.mp4",
      "size": 10485760
    }
  ],
  "comment": "这是我的第一次自我介绍练习"
}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "作业提交成功",
  "data": {
    "submitted": true,
    "cycleIndex": 0,
    "timeIndex": 0,
    "isCompleted": true,
    "earnedPoints": 10
  }
}
```

---

### 12. 分享作业

分享已完成作业到社交平台。

**请求：**
```
POST /api/homework/share
Authorization: Bearer {token}
Content-Type: application/json
```

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| homeworkId | string | ✅ | 作业ID |
| shareType | string | ✅ | 分享类型（chat/moments） |

**示例：**
```json
{
  "homeworkId": "homework_xxx",
  "shareType": "moments"
}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "分享成功",
  "data": {
    "shared": true,
    "shareType": "moments",
    "earnedPoints": 10
  }
}
```

---

### 13. 批改作业（教师）

教师批改学生作业。

**请求：**
```
PUT /api/homework/grade/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**权限：** 仅限 admin 和 teacher 角色

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| grade | string | ✅ | 评分（A/B/C/D） |
| teacherComment | string | ❌ | 评语 |
| voiceComment | string | ❌ | 语音评语URL |
| bonusPoints | number | ❌ | 奖励积分（0-100） |

**示例：**
```json
{
  "grade": "A",
  "teacherComment": "表现非常棒！",
  "bonusPoints": 5
}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "批改成功",
  "data": {
    "_id": "submission_xxx",
    "grade": "A",
    "teacherComment": "表现非常棒！",
    "bonusPoints": 5,
    "gradedAt": "2026-05-08T10:00:00.000Z"
  }
}
```

---

## 打卡模块

### 14. 获取打卡统计

获取当前用户的打卡统计信息。

**请求：**
```
GET /api/checkin/stats
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "totalCheckins": 15,
    "currentStreak": 5,
    "maxStreak": 10,
    "todayCheckins": 1
  }
}
```

---

### 15. 提交打卡

提交每日打卡记录。

**请求：**
```
POST /api/checkin/submit
Authorization: Bearer {token}
Content-Type: application/json
```

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| homeworkId | string | ✅ | 打卡作业ID |
| cycleIndex | number | ❌ | 周期索引（默认0） |
| timeIndex | number | ❌ | 次数索引（默认0） |
| shareType | string | ❌ | 分享类型（chat/moments） |

**示例：**
```json
{
  "homeworkId": "homework_xxx",
  "cycleIndex": 0,
  "timeIndex": 0,
  "shareType": "moments"
}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "打卡成功",
  "data": {
    "checkin": {
      "_id": "checkin_xxx",
      "homeworkId": "homework_xxx",
      "streak": 6,
      "pointsEarned": 5
    },
    "pointsEarned": 15,
    "currentStreak": 6,
    "totalCheckins": 16
  }
}
```

---

### 16. 获取打卡记录

获取用户的打卡记录列表。

**请求：**
```
GET /api/checkin/record
Authorization: Bearer {token}
```

**查询参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| homeworkId | string | ❌ | 作业ID |
| page | number | ❌ | 页码（默认1） |
| limit | number | ❌ | 每页数量（默认20） |

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": [
    {
      "_id": "checkin_xxx",
      "homeworkId": "homework_xxx",
      "homeworkTitle": "每日朗读打卡",
      "cycleIndex": 0,
      "timeIndex": 0,
      "streak": 5,
      "pointsEarned": 5,
      "shareType": "moments",
      "date": "2026-05-08T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

---

### 17. 获取作业打卡状态

获取指定作业的打卡状态。

**请求：**
```
GET /api/checkin/homework/{homeworkId}/status
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "homeworkId": "homework_xxx",
    "totalCycles": 7,
    "completedCycles": 3,
    "isCompleted": false,
    "checkins": [
      {
        "cycleIndex": 0,
        "timeIndex": 0,
        "date": "2026-05-08T00:00:00.000Z",
        "streak": 1,
        "pointsEarned": 5
      }
    ]
  }
}
```

---

### 18. 获取今日打卡

获取用户今日的打卡记录。

**请求：**
```
GET /api/checkin/today
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "count": 1,
    "checkins": [
      {
        "_id": "checkin_xxx",
        "homeworkId": "homework_xxx",
        "homeworkTitle": "每日朗读打卡",
        "streak": 5,
        "pointsEarned": 5,
        "date": "2026-05-08T09:30:00.000Z"
      }
    ]
  }
}
```

---

## 积分模块

### 19. 获取我的积分

获取当前用户的积分信息。

**请求：**
```
GET /api/points/my
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "current": 175,
    "earned": 200,
    "spent": 25,
    "history": 175
  }
}
```

---

### 20. 获取积分记录

获取用户的积分变动记录。

**请求：**
```
GET /api/points/records
Authorization: Bearer {token}
```

**查询参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | ❌ | 类型（earn/deduct） |
| source | string | ❌ | 来源（homework/checkin/share/bonus/manual） |
| startDate | string | ❌ | 开始日期 |
| endDate | string | ❌ | 结束日期 |
| page | number | ❌ | 页码（默认1） |
| limit | number | ❌ | 每页数量（默认20） |

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": [
    {
      "_id": "points_xxx",
      "type": "earn",
      "typeText": "获得",
      "source": "homework",
      "sourceText": "作业奖励",
      "amount": 10,
      "balance": 175,
      "description": "完成作业：自我介绍练习",
      "createdAt": "2026-05-08T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

---

### 21. 获取积分排行榜

获取积分排行榜。

**请求：**
```
GET /api/points/ranking
Authorization: Bearer {token}
```

**查询参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| period | string | ❌ | 时间周期（day/week/month/semester/year） |

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "period": "week",
    "periodText": "本周",
    "startDate": "2026-05-01T00:00:00.000Z",
    "myPoints": 50,
    "myRank": 3,
    "ranking": [
      {
        "rank": 1,
        "studentId": "user_xxx",
        "name": "张三",
        "totalPoints": 100,
        "avatar": null,
        "isCurrentUser": false
      },
      {
        "rank": 2,
        "studentId": "user_yyy",
        "name": "李四",
        "totalPoints": 80,
        "avatar": null,
        "isCurrentUser": false
      },
      {
        "rank": 3,
        "studentId": "user_zzz",
        "name": "小明",
        "totalPoints": 50,
        "avatar": null,
        "isCurrentUser": true
      }
    ]
  }
}
```

---

### 22. 获取积分统计

获取用户的积分统计信息。

**请求：**
```
GET /api/points/statistics
Authorization: Bearer {token}
```

**查询参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| period | string | ❌ | 时间周期（week/month/semester） |

**响应：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "period": "month",
    "periodText": "本月",
    "totalEarned": 150,
    "totalSpent": 0,
    "netChange": 150,
    "dailyData": [
      {
        "date": "2026-05-01",
        "earn": 20,
        "deduct": 0,
        "total": 20
      }
    ],
    "sourceData": [
      {
        "source": "homework",
        "sourceText": "作业奖励",
        "amount": 80
      },
      {
        "source": "checkin",
        "sourceText": "打卡奖励",
        "amount": 70
      }
    ]
  }
}
```

---

### 23. 调整积分（教师/管理员）

教师或管理员手动调整学生积分。

**请求：**
```
POST /api/points/adjust
Authorization: Bearer {token}
Content-Type: application/json
```

**权限：** 仅限 admin 和 teacher 角色

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentId | string | ✅ | 学生ID |
| amount | number | ✅ | 积分数量（1-1000） |
| type | string | ✅ | 类型（earn/deduct） |
| description | string | ❌ | 说明 |

**示例：**
```json
{
  "studentId": "user_xxx",
  "amount": 20,
  "type": "earn",
  "description": "作业完成优秀奖励"
}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "积分调整成功",
  "data": {
    "record": {
      "_id": "points_xxx",
      "type": "earn",
      "amount": 20,
      "balance": 195,
      "description": "作业完成优秀奖励"
    },
    "newBalance": 195
  }
}
```

---

## 批量接口

### 24. 批量获取初始化数据

一次性获取所有必要的初始化数据。

**请求：**
```
GET /api/batch/init
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "success": true,
  "message": "获取成功",
  "data": {
    "user": {
      "id": "user_xxx",
      "phone": "13800138004",
      "name": "小明",
      "role": "student",
      "points": 175,
      "avatar": null,
      "gender": "male",
      "birthday": null,
      "classIds": []
    },
    "courses": [...],
    "classes": [...],
    "homeworks": [...],
    "checkinStats": {
      "totalCheckins": 15,
      "currentStreak": 5,
      "maxStreak": 10,
      "todayCheckins": 1
    }
  }
}
```

---

## 错误码

### 通用错误码

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| SUCCESS | 200 | 操作成功 |
| VALIDATION_ERROR | 400 | 参数验证失败 |
| AUTH_FAILED | 401 | 认证失败 |
| TOKEN_INVALID | 401 | Token无效 |
| TOKEN_EXPIRED | 401 | Token已过期 |
| NOT_LOGGED_IN | 401 | 未登录 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| ROUTE_NOT_FOUND | 404 | 接口不存在 |
| DUPLICATE_ERROR | 400 | 重复数据 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

### 业务错误码

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| PHONE_EXISTS | 400 | 手机号已注册 |
| ACCOUNT_DISABLED | 401 | 账号已被禁用 |
| HOMEWORK_ID_REQUIRED | 400 | 作业ID不能为空 |
| NOT_FOUND | 404 | 作业不存在 |
| DEADLINE_PASSED | 400 | 作业已截止 |
| ALREADY_CHECKIN | 400 | 该周期已完成打卡 |
| NOT_CHECKIN_HOMEWORK | 400 | 该作业不是打卡作业 |
| INVALID_GRADE | 400 | 评分必须是A/B/C/D |
| INVALID_TYPE | 400 | 调整类型无效 |
| INVALID_AMOUNT | 400 | 积分数量无效 |
| INSUFFICIENT_POINTS | 400 | 积分不足 |
| ALREADY_SHARED | 400 | 作业已分享过 |
| HOMEWORK_NOT_COMPLETED | 400 | 请先完成作业再分享 |
| INVALID_SHARE_TYPE | 400 | 无效的分享类型 |
| TOO_MANY_REQUESTS | 429 | 请求过于频繁 |

---

## 速率限制

| 接口类型 | 限制 | 窗口 |
|---------|------|------|
| 认证接口 | 20次/请求 | 15分钟 |
| 通用API | 100次/请求 | 1分钟 |

---

## 数据模型

### 用户 (User)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | ObjectId | 用户ID |
| phone | String | 手机号 |
| password | String | 密码（加密存储） |
| name | String | 姓名 |
| avatar | String | 头像URL |
| gender | String | 性别 |
| birthday | Date | 生日 |
| role | String | 角色 |
| points | Number | 积分 |
| classIds | Array | 班级ID列表 |
| openid | String | 微信OpenID |
| isActive | Boolean | 是否激活 |
| lastLoginAt | Date | 最后登录时间 |

### 课程 (Course)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | ObjectId | 课程ID |
| name | String | 课程名称 |
| description | String | 课程描述 |
| level | String | 课程级别 |
| courseStatus | String | 课程状态 |
| courseType | String | 课程类型 |
| teacherIds | Array | 授课教师 |
| classIds | Array | 关联班级 |
| sections | Array | 课时安排 |

### 班级 (Class)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | ObjectId | 班级ID |
| courseId | ObjectId | 所属课程 |
| name | String | 班级名称 |
| teacherIds | Array | 授课教师 |
| headTeacherId | ObjectId | 班主任 |
| studentIds | Array | 学生列表 |
| studentCount | Number | 学生数量 |
| classroom | String | 教室 |
| classStatus | String | 班级状态 |

### 作业 (Homework)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | ObjectId | 作业ID |
| title | String | 作业标题 |
| content | String | 作业内容 |
| deadline | Date | 截止时间 |
| points | Number | 积分 |
| hasCheckin | Boolean | 是否打卡作业 |
| checkinPoints | Number | 打卡积分 |
| sharePoints | Number | 分享积分 |
| cycle | Object | 周期配置 |
| frequency | Object | 频率配置 |

### 积分记录 (PointsRecord)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | ObjectId | 记录ID |
| studentId | ObjectId | 学生ID |
| type | String | 类型（earn/deduct） |
| source | String | 来源 |
| amount | Number | 积分数量 |
| balance | Number | 变动后余额 |
| description | String | 说明 |
| operatedBy | ObjectId | 操作者 |

---

## 更新日志

### v1.0.0 (2026-05-08)
- 初始版本发布
- 支持用户认证
- 支持作业管理
- 支持打卡功能
- 支持积分系统
