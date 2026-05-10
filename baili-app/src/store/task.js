import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getTaskList,
  getTaskDetail,
  publishTask,
  submitTask,
  getSubmitRecords,
  gradeTask,
  getMySubmitRecords
} from '@/api/task'

export const useTaskStore = defineStore('task', () => {
  const taskList = ref([])
  const taskDetail = ref(null)
  const submitRecords = ref([])
  const mySubmitRecords = ref([])
  const currentFilter = ref({})
  const loading = ref(false)

  const fetchTaskList = async (params = {}) => {
    loading.value = true
    try {
      const res = await getTaskList(params)
      taskList.value = res.data.list || res.data
      currentFilter.value = params
      return res
    } finally {
      loading.value = false
    }
  }

  const fetchTaskDetail = async (id) => {
    loading.value = true
    try {
      const res = await getTaskDetail(id)
      taskDetail.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const doPublishTask = async (data) => {
    const res = await publishTask(data)
    return res
  }

  const doSubmitTask = async (data) => {
    const res = await submitTask(data)
    return res
  }

  const fetchSubmitRecords = async (taskId) => {
    loading.value = true
    try {
      const res = await getSubmitRecords(taskId)
      submitRecords.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const doGradeTask = async (data) => {
    const res = await gradeTask(data)
    return res
  }

  const fetchMySubmitRecords = async (params = {}) => {
    loading.value = true
    try {
      const res = await getMySubmitRecords(params)
      mySubmitRecords.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const setFilter = (filter) => {
    currentFilter.value = { ...currentFilter.value, ...filter }
  }

  const clearTaskDetail = () => {
    taskDetail.value = null
  }

  return {
    taskList,
    taskDetail,
    submitRecords,
    mySubmitRecords,
    currentFilter,
    loading,
    fetchTaskList,
    fetchTaskDetail,
    doPublishTask,
    doSubmitTask,
    fetchSubmitRecords,
    doGradeTask,
    fetchMySubmitRecords,
    setFilter,
    clearTaskDetail
  }
})
