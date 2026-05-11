import request from './request.js'

export const TASK_TYPE_HOMEWORK = 'homework'
export const TASK_TYPE_CHECKIN = 'checkin'

export default {
  task: {
    list: (params) => request({ url: '/api/task/list', method: 'GET', data: params }),
    create: (data) => request({ url: '/api/task', method: 'POST', data }),
    detail: (id) => request({ url: `/api/task/${id}` }),
    submit: (data) => request({ url: '/api/task/submit', method: 'POST', data }),
    submitMakeup: (data) => request({ url: '/api/task/submit/makeup', method: 'POST', data }),
    share: (data) => request({ url: '/api/task/share', method: 'POST', data }),
    shareSummary: (data) => request({ url: '/api/task/share/summary', method: 'POST', data }),
    grade: (id, data) => request({ url: `/api/task/grade/${id}`, method: 'PUT', data }),
    progress: (id) => request({ url: `/api/task/${id}/progress` })
  }
}

export const getTaskList = (params) => request({ url: '/api/task/list', method: 'GET', data: params })
export const createTask = (data) => request({ url: '/api/task', method: 'POST', data })
export const getTaskDetail = (id) => request({ url: `/api/task/${id}` })
export const submitTask = (data) => request({ url: '/api/task/submit', method: 'POST', data })
export const submitMakeupTask = (data) => request({ url: '/api/task/submit/makeup', method: 'POST', data })
export const recordShare = (data) => request({ url: '/api/task/share', method: 'POST', data })
export const shareSummary = (data) => request({ url: '/api/task/share/summary', method: 'POST', data })
export const gradeTask = (id, data) => request({ url: `/api/task/grade/${id}`, method: 'PUT', data })
export const getTaskProgress = (id) => request({ url: `/api/task/${id}/progress` })
