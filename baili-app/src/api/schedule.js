import { get, post, put, del } from './request'

export const getScheduleList = (params) => {
  return get('/schedule/list', params)
}

export const getScheduleDetail = (id) => {
  return get('/schedule/detail', { id })
}

export const createSchedule = (data) => {
  return post('/schedule/create', data)
}

export const updateSchedule = (data) => {
  return put('/schedule/update', data)
}

export const deleteSchedule = (id) => {
  return del('/schedule/delete', { id })
}

export const getTeacherSchedule = (teacherId, date) => {
  return get('/schedule/teacher', { teacherId, date })
}

export const getClassSchedule = (classId, date) => {
  return get('/schedule/class', { classId, date })
}

export default {
  getScheduleList,
  getScheduleDetail,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getTeacherSchedule,
  getClassSchedule
}
