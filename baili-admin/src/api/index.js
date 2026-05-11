import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getDashboard() {
  return request({
    url: '/admin/dashboard',
    method: 'get'
  })
}

export function getStudents(params) {
  return request({
    url: '/admin/student/list',
    method: 'get',
    params
  })
}

export function createStudent(data) {
  return request({
    url: '/admin/student/create',
    method: 'post',
    data
  })
}

export function updateStudent(id, data) {
  return request({
    url: `/admin/student/${id}`,
    method: 'put',
    data
  })
}

export function deleteStudent(id) {
  return request({
    url: `/admin/student/${id}`,
    method: 'delete'
  })
}

export function importStudents(data) {
  return request({
    url: '/admin/student/import',
    method: 'post',
    data
  })
}

export function getTeachers(params) {
  return request({
    url: '/admin/teacher/list',
    method: 'get',
    params
  })
}

export function createTeacher(data) {
  return request({
    url: '/admin/teacher/create',
    method: 'post',
    data
  })
}

export function updateTeacher(id, data) {
  return request({
    url: `/admin/teacher/${id}`,
    method: 'put',
    data
  })
}

export function deleteTeacher(id) {
  return request({
    url: `/admin/teacher/${id}`,
    method: 'delete'
  })
}

export function getCourses(params) {
  return request({
    url: '/admin/course/list',
    method: 'get',
    params
  })
}

export function createCourse(data) {
  return request({
    url: '/admin/course/create',
    method: 'post',
    data
  })
}

export function updateCourse(id, data) {
  return request({
    url: `/admin/course/${id}`,
    method: 'put',
    data
  })
}

export function deleteCourse(id) {
  return request({
    url: `/admin/course/${id}`,
    method: 'delete'
  })
}

export function getClasses(params) {
  return request({
    url: '/admin/class/list',
    method: 'get',
    params
  })
}

export function createClass(data) {
  return request({
    url: '/admin/class/create',
    method: 'post',
    data
  })
}

export function updateClass(id, data) {
  return request({
    url: `/admin/class/${id}`,
    method: 'put',
    data
  })
}

export function deleteClass(id) {
  return request({
    url: `/admin/class/${id}`,
    method: 'delete'
  })
}

export function getSchedules(params) {
  return request({
    url: '/admin/schedule/list',
    method: 'get',
    params
  })
}

export function createSchedule(data) {
  return request({
    url: '/admin/schedule/create',
    method: 'post',
    data
  })
}

export function updateSchedule(id, data) {
  return request({
    url: `/admin/schedule/${id}`,
    method: 'put',
    data
  })
}

export function deleteSchedule(id) {
  return request({
    url: `/admin/schedule/${id}`,
    method: 'delete'
  })
}

export function checkConflict(data) {
  return request({
    url: '/admin/schedule/check-conflict',
    method: 'post',
    data
  })
}

export function getTeacherSchedule(teacherId) {
  return request({
    url: `/admin/schedule/teacher/${teacherId}`,
    method: 'get'
  })
}

export function getClassSchedule(classId) {
  return request({
    url: `/admin/schedule/class/${classId}`,
    method: 'get'
  })
}
