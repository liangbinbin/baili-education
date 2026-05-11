import { get, post, put, del } from './request'

// 模拟排课数据
const mockSchedules = [
  {
    id: '1',
    classId: '1',
    className: '演讲基础一班',
    teacherId: '1',
    teacherName: '李老师',
    courseId: '1',
    courseName: '演讲基础',
    dayOfWeek: 1,
    startTime: '19:00',
    endTime: '20:30',
    classroom: '101教室',
    status: 1
  },
  {
    id: '2',
    classId: '1',
    className: '演讲基础一班',
    teacherId: '1',
    teacherName: '李老师',
    courseId: '1',
    courseName: '演讲基础',
    dayOfWeek: 3,
    startTime: '19:00',
    endTime: '20:30',
    classroom: '101教室',
    status: 1
  },
  {
    id: '3',
    classId: '2',
    className: '演讲进阶一班',
    teacherId: '2',
    teacherName: '王老师',
    courseId: '2',
    courseName: '演讲进阶',
    dayOfWeek: 2,
    startTime: '19:00',
    endTime: '20:30',
    classroom: '102教室',
    status: 1
  }
]

export const getScheduleList = (params) => Promise.resolve({ list: mockSchedules })

export const getScheduleDetail = (id) => Promise.resolve(mockSchedules.find(s => s.id === id) || mockSchedules[0])

export const createSchedule = (data) => Promise.resolve({ success: true })

export const updateSchedule = (data) => Promise.resolve({ success: true })

export const deleteSchedule = (id) => Promise.resolve({ success: true })

export const getTeacherSchedule = (teacherId, date) => Promise.resolve({ list: mockSchedules.filter(s => s.teacherId === teacherId) })

export const getClassSchedule = (classId, date) => Promise.resolve({ list: mockSchedules.filter(s => s.classId === classId) })

export default {
  getScheduleList,
  getScheduleDetail,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getTeacherSchedule,
  getClassSchedule
}
