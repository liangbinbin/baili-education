import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getCourseList,
  getCourseDetail,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses
} from '@/api/course'

export const useCourseStore = defineStore('course', () => {
  const courseList = ref([])
  const courseDetail = ref(null)
  const myCourses = ref([])
  const loading = ref(false)

  const fetchCourseList = async (params = {}) => {
    loading.value = true
    try {
      const res = await getCourseList(params)
      courseList.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const fetchCourseDetail = async (id) => {
    loading.value = true
    try {
      const res = await getCourseDetail(id)
      courseDetail.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const doCreateCourse = async (data) => {
    const res = await createCourse(data)
    return res
  }

  const doUpdateCourse = async (data) => {
    const res = await updateCourse(data)
    return res
  }

  const doDeleteCourse = async (id) => {
    const res = await deleteCourse(id)
    return res
  }

  const fetchMyCourses = async () => {
    loading.value = true
    try {
      const res = await getMyCourses()
      myCourses.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const clearCourseDetail = () => {
    courseDetail.value = null
  }

  return {
    courseList,
    courseDetail,
    myCourses,
    loading,
    fetchCourseList,
    fetchCourseDetail,
    doCreateCourse,
    doUpdateCourse,
    doDeleteCourse,
    fetchMyCourses,
    clearCourseDetail
  }
})
