import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getTaskList,
  getTaskDetail,
  publishTask,
  submitTask,
  getSubmitRecords,
  gradeTask,
  getMySubmitRecords,
  recordShare,
  getTaskStats
} from '@/api/task'

export const useTaskStore = defineStore('task', () =&gt; {
  const taskList = ref([])
  const currentTask = ref(null)
  const submitRecords = ref([])
  const stats = ref({
    pendingCount: 0,
    streakDays: 0,
    totalDays: 0,
    longestStreak: 0,
    totalPoints: 0,
    todayChecked: false
  })
  const loading = ref(false)
  const filter = ref({
    type: '',
    classId: '',
    status: ''
  })

  const homeworkList = computed(() =&gt; 
    taskList.value.filter(t =&gt; t.type === 'homework')
  )

  const checkinList = computed(() =&gt; 
    taskList.value.filter(t =&gt; t.type === 'checkin')
  )

  const pendingList = computed(() =&gt; 
    taskList.value.filter(t =&gt; t.status === 'active')
  )

  const completedList = computed(() =&gt; 
    taskList.value.filter(t =&gt; t.status === 'completed')
  )

  const fetchTaskList = async (params = {}) =&gt; {
    loading.value = true
    try {
      const res = await getTaskList({
        ...filter.value,
        ...params
      })
      taskList.value = res.list || res.data?.list || res.data || []
      if (res.stats) {
        stats.value = { ...stats.value, ...res.stats }
      }
      return res
    } catch (error) {
      console.error('获取任务列表失败:', error)
      uni.showToast({ title: '获取任务列表失败', icon: 'none' })
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchTaskDetail = async (id) =&gt; {
    loading.value = true
    try {
      const res = await getTaskDetail(id)
      currentTask.value = res.data || res
      return currentTask.value
    } catch (error) {
      console.error('获取任务详情失败:', error)
      uni.showToast({ title: '获取任务详情失败', icon: 'none' })
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchSubmitRecords = async (taskId, params = {}) =&gt; {
    loading.value = true
    try {
      const res = await getSubmitRecords(taskId, params)
      submitRecords.value = res.list || res.data?.list || res.data || res || []
      return submitRecords.value
    } catch (error) {
      console.error('获取提交记录失败:', error)
      uni.showToast({ title: '获取提交记录失败', icon: 'none' })
      throw error
    } finally {
      loading.value = false
    }
  }

  const doSubmitTask = async (data) =&gt; {
    try {
      const res = await submitTask(data)
      await fetchTaskList()
      if (currentTask.value && currentTask.value.id === data.taskId) {
        await fetchTaskDetail(data.taskId)
      }
      return res
    } catch (error) {
      console.error('提交任务失败:', error)
      throw error
    }
  }

  const doRecordShare = async (data) =&gt; {
    try {
      const res = await recordShare(data)
      if (currentTask.value) {
        await fetchTaskDetail(currentTask.value.id)
      }
      return res
    } catch (error) {
      console.error('记录分享失败:', error)
      throw error
    }
  }

  const fetchStats = async () =&gt; {
    try {
      const res = await getTaskStats()
      stats.value = res.data || res || stats.value
      return stats.value
    } catch (error) {
      console.error('获取统计失败:', error)
      uni.showToast({ title: '获取统计失败', icon: 'none' })
      throw error
    }
  }

  const setFilter = (newFilter) =&gt; {
    filter.value = { ...filter.value, ...newFilter }
    fetchTaskList()
  }

  const clearCurrent = () =&gt; {
    currentTask.value = null
    submitRecords.value = []
  }

  return {
    taskList,
    currentTask,
    submitRecords,
    stats,
    loading,
    filter,
    homeworkList,
    checkinList,
    pendingList,
    completedList,
    fetchTaskList,
    fetchTaskDetail,
    fetchSubmitRecords,
    doSubmitTask,
    doRecordShare,
    fetchStats,
    setFilter,
    clearCurrent
  }
})
