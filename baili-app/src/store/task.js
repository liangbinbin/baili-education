import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/task.js'
import { getCheckinStats } from '@/api/checkin.js'

export const useTaskStore = defineStore('task', () => {
  const taskList = ref([])
  const currentTask = ref(null)
  const currentTaskProgress = ref(null)
  const submitRecords = ref([])
  const checkinStats = ref({
    total: 0,
    streak: 0,
    maxStreak: 0,
    today: 0,
    shareStats: {
      totalChatShares: 0,
      totalMomentsShares: 0,
      momentsPointsEarned: 0,
      completionBonusEarned: 0
    }
  })
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })
  const filter = ref({
    type: '',
    classId: '',
    status: '',
    date: ''
  })

  const homeworkList = computed(() => 
    taskList.value.filter(t => t.type === 'homework')
  )

  const checkinList = computed(() => 
    taskList.value.filter(t => t.type === 'checkin')
  )

  const pendingList = computed(() => 
    taskList.value.filter(t => t.status === 'active')
  )

  const completedList = computed(() => 
    taskList.value.filter(t => 
      t.status === 'ended' || t.progress?.completedDays >= t.progress?.totalDays
    )
  )

  const fetchTaskList = async (params = {}) => {
    loading.value = true
    try {
      const data = await api.getTaskList({
        ...filter.value,
        ...params
      })
      taskList.value = data.list || data.data?.list || data.data || []
      if (data.pagination) {
        pagination.value = data.pagination
      } else if (data.data?.pagination) {
        pagination.value = data.data.pagination
      }
      return data
    } catch (error) {
      console.error('获取任务列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchTaskDetail = async (id) => {
    loading.value = true
    try {
      const data = await api.getTaskDetail(id)
      currentTask.value = data
      return data
    } catch (error) {
      console.error('获取任务详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchTaskProgress = async (id) => {
    loading.value = true
    try {
      const data = await api.getTaskProgress(id)
      currentTaskProgress.value = data
      submitRecords.value = data.dailyProgress || []
      return data
    } catch (error) {
      console.error('获取任务进度失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const doSubmitTask = async (data) => {
    const result = await api.submitTask(data)
    await fetchTaskList()
    if (currentTask.value && currentTask.value._id === data.taskId) {
      await fetchTaskDetail(data.taskId)
    }
    return result
  }

  const doSubmitMakeupTask = async (data) => {
    const result = await api.submitMakeupTask(data)
    await fetchTaskList()
    if (currentTask.value && currentTask.value._id === data.taskId) {
      await fetchTaskDetail(data.taskId)
    }
    return result
  }

  const doRecordShare = async (data) => {
    const result = await api.recordShare(data)
    if (currentTask.value && currentTask.value._id === data.taskId) {
      await fetchTaskDetail(data.taskId)
    }
    return result
  }

  const doShareSummary = async (data) => {
    const result = await api.shareSummary(data)
    if (currentTask.value && currentTask.value._id === data.taskId) {
      await fetchTaskDetail(data.taskId)
    }
    return result
  }

  const doGradeTask = async (id, data) => {
    const result = await api.gradeTask(id, data)
    await fetchTaskList()
    if (currentTask.value) {
      await fetchTaskDetail(currentTask.value._id)
    }
    return result
  }

  const fetchCheckinStats = async () => {
    try {
      const data = await getCheckinStats()
      checkinStats.value = data || checkinStats.value
      return data
    } catch (error) {
      console.error('获取打卡统计失败:', error)
      throw error
    }
  }

  const setFilter = (newFilter) => {
    filter.value = { ...filter.value, ...newFilter }
    fetchTaskList()
  }

  const clearCurrent = () => {
    currentTask.value = null
    currentTaskProgress.value = null
    submitRecords.value = []
  }

  return {
    taskList,
    currentTask,
    currentTaskProgress,
    submitRecords,
    checkinStats,
    loading,
    pagination,
    filter,
    homeworkList,
    checkinList,
    pendingList,
    completedList,
    fetchTaskList,
    fetchTaskDetail,
    fetchTaskProgress,
    doSubmitTask,
    doSubmitMakeupTask,
    doRecordShare,
    doShareSummary,
    doGradeTask,
    fetchCheckinStats,
    setFilter,
    clearCurrent
  }
})
