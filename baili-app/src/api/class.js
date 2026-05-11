import { get, post, put, del } from './request'

// 模拟班级数据
const mockClasses = [
  {
    id: '1',
    name: '演讲基础一班',
    courseName: '演讲基础',
    teacherName: '李老师',
    totalStudents: 45,
    schedule: '每周一、三、五 19:00-20:30'
  },
  {
    id: '2',
    name: '演讲进阶一班',
    courseName: '演讲进阶',
    teacherName: '王老师',
    totalStudents: 32,
    schedule: '每周二、四 19:00-20:30'
  },
  {
    id: '3',
    name: '少儿口才一班',
    courseName: '少儿口才',
    teacherName: '张老师',
    totalStudents: 58,
    schedule: '每周六、日 10:00-11:30'
  }
]

// 模拟班级成员数据
const mockMembers = [
  { id: '1', name: '小明同学', avatar: '', points: 850, joinDate: '2024-01-15' },
  { id: '2', name: '小红同学', avatar: '', points: 1200, joinDate: '2024-01-10' },
  { id: '3', name: '小华同学', avatar: '', points: 680, joinDate: '2024-02-01' }
]

export const getClassList = (params) => Promise.resolve({ list: mockClasses })

export const getClassDetail = (id) => Promise.resolve(mockClasses.find(c => c.id === id) || mockClasses[0])

export const createClass = (data) => Promise.resolve({ success: true })

export const updateClass = (data) => Promise.resolve({ success: true })

export const deleteClass = (id) => Promise.resolve({ success: true })

export const getClassMembers = (classId) => Promise.resolve({ list: mockMembers })

export const addClassMember = (data) => Promise.resolve({ success: true })

export const removeClassMember = (classId, studentId) => Promise.resolve({ success: true })

export const getMyClasses = () => Promise.resolve({ list: mockClasses.slice(0, 2) })

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
