import { get, post, put, del } from './request'

// 模拟课程数据
const mockCourses = [
  {
    id: '1',
    name: '演讲基础',
    description: '从零开始学习演讲技巧',
    coverUrl: '',
    totalStudents: 156,
    totalClasses: 24,
    teacherName: '李老师'
  },
  {
    id: '2',
    name: '演讲进阶',
    description: '提升演讲表现力',
    coverUrl: '',
    totalStudents: 89,
    totalClasses: 18,
    teacherName: '王老师'
  },
  {
    id: '3',
    name: '少儿口才',
    description: '培养孩子的表达能力',
    coverUrl: '',
    totalStudents: 234,
    totalClasses: 32,
    teacherName: '张老师'
  }
]

export const getCourseList = (params) => Promise.resolve({ list: mockCourses })

export const getCourseDetail = (id) => Promise.resolve(mockCourses.find(c => c.id === id) || mockCourses[0])

export const createCourse = (data) => Promise.resolve({ success: true })

export const updateCourse = (data) => Promise.resolve({ success: true })

export const deleteCourse = (id) => Promise.resolve({ success: true })

export const getMyCourses = () => Promise.resolve({ list: mockCourses.slice(0, 2) })

export default {
  getCourseList,
  getCourseDetail,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses
}
