import { storage } from './storage'

export const ROLE_STUDENT = 'student'
export const ROLE_TEACHER = 'teacher'

export const getRole = () => {
  const user = storage.get('user')
  return user?.role || null
}

export const isStudent = () => {
  return getRole() === ROLE_STUDENT
}

export const isTeacher = () => {
  return getRole() === ROLE_TEACHER
}

export const hasPermission = (permission) => {
  const user = storage.get('user')
  if (!user) return false
  const permissions = user.permissions || []
  return permissions.includes(permission)
}

export const hasAnyPermission = (permissions) => {
  return permissions.some(p => hasPermission(p))
}

export const hasAllPermissions = (permissions) => {
  return permissions.every(p => hasPermission(p))
}

export default {
  ROLE_STUDENT,
  ROLE_TEACHER,
  getRole,
  isStudent,
  isTeacher,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
}
