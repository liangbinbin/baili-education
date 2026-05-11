import { get, post } from './request'

export const TASK_TYPE_HOMEWORK = 'homework'
export const TASK_TYPE_CHECKIN = 'checkin'

export const getTaskList = (params) =&gt; {
  return get('/task/list', params)
}

export const getTaskDetail = (id) =&gt; {
  return get('/task/detail', { id })
}

export const publishTask = (data) =&gt; {
  return post('/task/publish', data)
}

export const submitTask = (data) =&gt; {
  return post('/task/submit', data)
}

export const getSubmitRecords = (taskId, params) =&gt; {
  return get('/task/submit-records', { taskId, ...params })
}

export const gradeTask = (data) =&gt; {
  return post('/task/grade', data)
}

export const getMySubmitRecords = (params) =&gt; {
  return get('/task/my-submit-records', params)
}

export const recordShare = (data) =&gt; {
  return post('/task/share', data)
}

export const getTaskStats = () =&gt; {
  return get('/task/stats')
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
  getMySubmitRecords,
  recordShare,
  getTaskStats
}
