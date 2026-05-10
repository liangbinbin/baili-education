import { get, post, put, del } from './request'

export const getClassList = (params) => {
  return get('/class/list', params)
}

export const getClassDetail = (id) => {
  return get('/class/detail', { id })
}

export const createClass = (data) => {
  return post('/class/create', data)
}

export const updateClass = (data) => {
  return put('/class/update', data)
}

export const deleteClass = (id) => {
  return del('/class/delete', { id })
}

export const getClassMembers = (classId) => {
  return get('/class/members', { classId })
}

export const addClassMember = (data) => {
  return post('/class/add-member', data)
}

export const removeClassMember = (classId, studentId) => {
  return del('/class/remove-member', { classId, studentId })
}

export const getMyClasses = () => {
  return get('/class/my')
}

export default {
  getClassList,
  getClassDetail,
  createClass,
  updateClass,
  deleteClass,
  getClassMembers,
  addClassMember,
  removeClassMember,
  getMyClasses
}
