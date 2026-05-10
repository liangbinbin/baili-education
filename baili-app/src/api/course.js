import { get, post, put, del } from './request'

export const getCourseList = (params) => {
  return get('/course/list', params)
}

export const getCourseDetail = (id) => {
  return get('/course/detail', { id })
}

export const createCourse = (data) => {
  return post('/course/create', data)
}

export const updateCourse = (data) => {
  return put('/course/update', data)
}

export const deleteCourse = (id) => {
  return del('/course/delete', { id })
}

export const getMyCourses = () => {
  return get('/course/my')
}

export default {
  getCourseList,
  getCourseDetail,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses
}
