import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getScheduleList,
  getScheduleDetail,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getTeacherSchedule,
  getClassSchedule
} from '@/api/schedule'

export const useScheduleStore = defineStore('schedule', () => {
  const scheduleList = ref([])
  const scheduleDetail = ref(null)
  const teacherSchedule = ref([])
  const classSchedule = ref([])
  const loading = ref(false)

  const fetchScheduleList = async (params = {}) => {
    loading.value = true
    try {
      const res = await getScheduleList(params)
      scheduleList.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const fetchScheduleDetail = async (id) => {
    loading.value = true
    try {
      const res = await getScheduleDetail(id)
      scheduleDetail.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const doCreateSchedule = async (data) => {
    const res = await createSchedule(data)
    return res
  }

  const doUpdateSchedule = async (data) => {
    const res = await updateSchedule(data)
    return res
  }

  const doDeleteSchedule = async (id) => {
    const res = await deleteSchedule(id)
    return res
  }

  const fetchTeacherSchedule = async (teacherId, date) => {
    loading.value = true
    try {
      const res = await getTeacherSchedule(teacherId, date)
      teacherSchedule.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const fetchClassSchedule = async (classId, date) => {
    loading.value = true
    try {
      const res = await getClassSchedule(classId, date)
      classSchedule.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const clearScheduleDetail = () => {
    scheduleDetail.value = null
  }

  return {
    scheduleList,
    scheduleDetail,
    teacherSchedule,
    classSchedule,
    loading,
    fetchScheduleList,
    fetchScheduleDetail,
    doCreateSchedule,
    doUpdateSchedule,
    doDeleteSchedule,
    fetchTeacherSchedule,
    fetchClassSchedule,
    clearScheduleDetail
  }
})
