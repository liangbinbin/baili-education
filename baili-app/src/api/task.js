import { get, post, put } from './request'

export const TASK_TYPE_HOMEWORK = 'homework'
export const TASK_TYPE_CHECKIN = 'checkin'

export const getTaskList = (params) => {
  return get('/task/list', params)
}

export const getTaskDetail = (id) => {
  return get('/task/detail', { id })
}

export const publishTask = (data) => {
  return post('/task/publish', data)
}

export const submitTask = (data) => {
  return post('/task/submit', data)
}

export const getSubmitRecords = (taskId) => {
  return get('/task/submit-records', { taskId })
}

export const gradeTask = (data) => {
  return put('/task/grade', data)
}

export const getMySubmitRecords = (params) => {
  return get('/task/my-submit-records', params)
}

export default {
  TASK_TYPE_HOMEWORK,
  TASK_TYPE_CHECKIN,
  getTaskList,
  getTaskDetail,
  publishTask,
  submitTask,
  getSubmitRecords,
  gradeTask,
  getMySubmitRecords
}
