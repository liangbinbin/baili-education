import request from './request.js'

export const TASK_TYPE_HOMEWORK = 'homework'
export const TASK_TYPE_CHECKIN = 'checkin'

// 模拟任务数据
const mockTasks = [
  {
    _id: '1',
    title: '《演讲基础》第3周作业',
    type: 'homework',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    frequencyMode: 'daily_once',
    classIds: [{ name: '演讲基础一班' }],
    completionPoints: 50,
    progress: {
      completedDays: 2,
      totalDays: 7,
      percentage: 28.57
    },
    todaySubmission: {
      submitted: false
    }
  },
  {
    _id: '2',
    title: '《演讲进阶》每日打卡',
    type: 'checkin',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    frequencyMode: 'daily_once',
    classIds: [{ name: '演讲进阶一班' }],
    completionPoints: 100,
    checkinSharePoints: 5,
    progress: {
      completedDays: 5,
      totalDays: 14,
      percentage: 35.71
    },
    todaySubmission: {
      submitted: true
    }
  }
]

// 模拟任务进度数据
const mockProgress = {
  dailyProgress: [
    {
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dayIndex: 1,
      isCompleted: true,
      pointsEarned: 10,
      isSharedToChat: true,
      isSharedToMoments: true,
      files: [{ type: 'video', name: 'day1_video.mp4' }],
      grade: 'A',
      comment: '表现很好！',
      bonusPoints: 5
    },
    {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dayIndex: 2,
      isCompleted: true,
      pointsEarned: 10,
      isSharedToChat: false,
      isSharedToMoments: false,
      files: [{ type: 'audio', name: 'day2_audio.mp3' }]
    }
  ]
}

export default {
  task: {
    list: (params) => Promise.resolve({ list: mockTasks, pagination: { page: 1, pageSize: 10, total: 2, totalPages: 1 } }),
    create: (data) => Promise.resolve({ success: true }),
    detail: (id) => Promise.resolve(mockTasks.find(t => t._id === id) || mockTasks[0]),
    submit: (data) => Promise.resolve({ success: true }),
    submitMakeup: (data) => Promise.resolve({ success: true }),
    share: (data) => Promise.resolve({ success: true }),
    shareSummary: (data) => Promise.resolve({ success: true }),
    grade: (id, data) => Promise.resolve({ success: true }),
    progress: (id) => Promise.resolve(mockProgress)
  }
}

export const getTaskList = (params) => Promise.resolve({ list: mockTasks, pagination: { page: 1, pageSize: 10, total: 2, totalPages: 1 } })
export const createTask = (data) => Promise.resolve({ success: true })
export const getTaskDetail = (id) => Promise.resolve(mockTasks.find(t => t._id === id) || mockTasks[0])
export const submitTask = (data) => Promise.resolve({ success: true })
export const submitMakeupTask = (data) => Promise.resolve({ success: true })
export const recordShare = (data) => Promise.resolve({ success: true })
export const shareSummary = (data) => Promise.resolve({ success: true })
export const gradeTask = (id, data) => Promise.resolve({ success: true })
export const getTaskProgress = (id) => Promise.resolve(mockProgress)
