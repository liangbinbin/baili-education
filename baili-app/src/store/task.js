import { defineStore } from 'pinia'
import { 
  getTaskList, 
  getTaskDetail, 
  submitTask, 
  submitMakeupTask, 
  recordShare, 
  shareSummary,
  gradeTask, 
  getTaskProgress 
} from '@/api/task'
import { getCheckinStats } from '@/api/checkin'
import storage from '@/utils/storage'

export const useTaskStore = defineStore('task', {
  // ========== State ==========
  state: () => ({
    taskList: [],
    currentTask: null,
    currentTaskProgress: null,
    submitRecords: [],
    checkinStats: {
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
    },
    filters: {
      type: '',         // '' | 'homework' | 'checkin'
      classId: '',
      status: '',       // '' | 'pending' | 'active' | 'completed'
      date: ''
    },
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    },
    loading: false
  }),
  
  // ========== Getters ==========
  getters: {
    // 按类型筛选
    homeworkList: (state) => state.taskList.filter(t => t.type === 'homework'),
    checkinList: (state) => state.taskList.filter(t => t.type === 'checkin'),
    
    // 按状态筛选
    pendingList: (state) => state.taskList.filter(t => {
      const now = new Date()
      const startDate = new Date(t.startDate)
      const endDate = new Date(t.endDate)
      if (now < startDate || now > endDate) return false
      return t.progress?.completedDays < t.progress?.totalDays
    }),
    completedList: (state) => state.taskList.filter(t => {
      const now = new Date()
      const endDate = new Date(t.endDate)
      if (now > endDate) return true
      return t.progress?.completedDays >= t.progress?.totalDays
    }),
    
    // 统计
    pendingCount: (state) => state.taskList.filter(t => {
      const now = new Date()
      const startDate = new Date(t.startDate)
      const endDate = new Date(t.endDate)
      if (now < startDate || now > endDate) return false
      return t.progress?.completedDays < t.progress?.totalDays
    }).length,
    
    completedCount: (state) => state.taskList.filter(t => {
      const now = new Date()
      const endDate = new Date(t.endDate)
      if (now > endDate) return true
      return t.progress?.completedDays >= t.progress?.totalDays
    }).length,
    
    isEmpty: (state) => state.taskList.length === 0
  },
  
  // ========== Actions ==========
  actions: {
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1
    },
    
    async fetchTasks(append = false) {
      this.loading = true
      
      // 尝试获取缓存
      const cacheKey = `task-${this.filters.type}-${this.filters.status}`
      const cached = storage.get(cacheKey)
      
      if (cached && !append && Date.now() - cached.expire < 30000) {
        this.taskList = cached.data.list
        this.pagination = cached.data.pagination || this.pagination
        this.loading = false
        return
      }
      
      try {
        const result = await getTaskList({
          type: this.filters.type || undefined,
          classId: this.filters.classId || undefined,
          status: this.filters.status || undefined,
          date: this.filters.date || undefined,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
        })
        
        const list = result.list || result.data?.list || result.data || []
        const pagination = result.pagination || result.data?.pagination
        
        if (append) {
          this.taskList.push(...list)
        } else {
          this.taskList = list
        }
        
        if (pagination) {
          this.pagination = pagination
        }
        
        // 缓存结果
        storage.set(cacheKey, {
          data: { list: this.taskList, pagination: this.pagination },
          expire: Date.now()
        })
      } catch (error) {
        console.error('获取任务列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchTaskDetail(id) {
      this.loading = true
      try {
        const result = await getTaskDetail(id)
        this.currentTask = result
        return result
      } catch (error) {
        console.error('获取任务详情失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchTaskProgress(id) {
      this.loading = true
      try {
        const result = await getTaskProgress(id)
        this.currentTaskProgress = result
        this.submitRecords = result.dailyProgress || []
        return result
      } catch (error) {
        console.error('获取任务进度失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async doSubmitTask(data) {
      this.loading = true
      try {
        const result = await submitTask(data)
        
        // 清除缓存
        storage.remove(`task-${this.filters.type}-${this.filters.status}`)
        
        // 重新获取列表
        await this.fetchTasks()
        
        // 更新当前任务
        if (this.currentTask && this.currentTask._id === data.taskId) {
          await this.fetchTaskDetail(data.taskId)
        }
        
        return result
      } catch (error) {
        console.error('提交任务失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async doSubmitMakeupTask(data) {
      this.loading = true
      try {
        const result = await submitMakeupTask(data)
        
        // 清除缓存
        storage.remove(`task-${this.filters.type}-${this.filters.status}`)
        
        // 重新获取列表
        await this.fetchTasks()
        
        // 更新当前任务
        if (this.currentTask && this.currentTask._id === data.taskId) {
          await this.fetchTaskDetail(data.taskId)
        }
        
        return result
      } catch (error) {
        console.error('补交任务失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async doRecordShare(data) {
      this.loading = true
      try {
        const result = await recordShare(data)
        
        // 更新当前任务
        if (this.currentTask && this.currentTask._id === data.taskId) {
          await this.fetchTaskDetail(data.taskId)
        }
        
        return result
      } catch (error) {
        console.error('分享任务失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async doShareSummary(data) {
      this.loading = true
      try {
        const result = await shareSummary(data)
        
        // 更新当前任务
        if (this.currentTask && this.currentTask._id === data.taskId) {
          await this.fetchTaskDetail(data.taskId)
        }
        
        return result
      } catch (error) {
        console.error('总体分享失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async doGradeTask(id, data) {
      this.loading = true
      try {
        const result = await gradeTask(id, data)
        
        // 清除缓存
        storage.remove(`task-${this.filters.type}-${this.filters.status}`)
        
        // 重新获取列表
        await this.fetchTasks()
        
        // 更新当前任务
        if (this.currentTask) {
          await this.fetchTaskDetail(this.currentTask._id)
        }
        
        return result
      } catch (error) {
        console.error('批改任务失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchCheckinStats() {
      try {
        const result = await getCheckinStats()
        this.checkinStats = result || this.checkinStats
        return result
      } catch (error) {
        console.error('获取打卡统计失败:', error)
        throw error
      }
    },
    
    clearCurrent() {
      this.currentTask = null
      this.currentTaskProgress = null
      this.submitRecords = []
    }
  }
})
