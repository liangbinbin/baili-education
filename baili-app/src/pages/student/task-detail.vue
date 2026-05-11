&lt;template&gt;
  &lt;view class="task-detail-page"&gt;
    &lt;Navbar title="任务详情" /&gt;

    &lt;view v-if="loading" class="loading-container"&gt;
      &lt;text class="loading-text"&gt;加载中...&lt;/text&gt;
    &lt;/view&gt;

    &lt;view v-else-if="!task" class="empty-container"&gt;
      &lt;EmptyState description="任务不存在" /&gt;
    &lt;/view&gt;

    &lt;view v-else class="content"&gt;
      &lt;view class="info-card"&gt;
        &lt;view class="info-header"&gt;
          &lt;view class="task-type-badge" :class="task.type"&gt;
            &lt;text v-if="task.type === 'homework'"&gt;📝 作业&lt;/text&gt;
            &lt;text v-else&gt;🔥 打卡&lt;/text&gt;
          &lt;/view&gt;
          &lt;view class="task-frequency" :class="task.frequency?.mode" v-if="task.frequency"&gt;
            &lt;text v-if="task.frequency.mode === 'daily_once'"&gt;每日一次&lt;/text&gt;
            &lt;text v-else-if="task.frequency.mode === 'daily_multi'"&gt;每日多次&lt;/text&gt;
            &lt;text v-else&gt;每周固定&lt;/text&gt;
          &lt;/view&gt;
        &lt;/view&gt;
        &lt;text class="task-title"&gt;{{ task.title }}&lt;/text&gt;
        &lt;view class="task-meta"&gt;
          &lt;view class="meta-item" v-if="task.className"&gt;
            &lt;text class="meta-icon"&gt;👥&lt;/text&gt;
            &lt;text class="meta-text"&gt;{{ task.className }}&lt;/text&gt;
          &lt;/view&gt;
          &lt;view class="meta-item" v-if="task.teacherName"&gt;
            &lt;text class="meta-icon"&gt;👤&lt;/text&gt;
            &lt;text class="meta-text"&gt;{{ task.teacherName }}&lt;/text&gt;
          &lt;/view&gt;
          &lt;view class="meta-item"&gt;
            &lt;text class="meta-icon"&gt;📅&lt;/text&gt;
            &lt;text class="meta-text"&gt;{{ formatDate(task.startDate) }} - {{ formatDate(task.endDate) }}&lt;/text&gt;
          &lt;/view&gt;
        &lt;/view&gt;
        &lt;view class="progress-section" v-if="task.totalDays !== undefined"&gt;
          &lt;view class="progress-info"&gt;
            &lt;text class="progress-text"&gt;进度：{{ task.submitCount || 0 }}/{{ task.totalDays }}&lt;/text&gt;
          &lt;/view&gt;
          &lt;view class="progress-bar"&gt;
            &lt;view class="progress-fill" :style="{ width: progressPercent + '%' }"&gt;&lt;/view&gt;
          &lt;/view&gt;
        &lt;/view&gt;
      &lt;/view&gt;

      &lt;view class="points-card" v-if="task.points"&gt;
        &lt;view class="points-header"&gt;
          &lt;text class="points-title"&gt;📖 积分规则&lt;/text&gt;
        &lt;/view&gt;
        &lt;view class="points-list"&gt;
          &lt;view class="points-item" v-if="task.points.submit !== undefined"&gt;
            &lt;text class="points-label"&gt;{{ task.type === 'checkin' ? '每日打卡' : '完成任务' }}&lt;/text&gt;
            &lt;text class="points-value"&gt;+{{ task.points.submit }}积分&lt;/text&gt;
          &lt;/view&gt;
          &lt;view class="points-item" v-if="task.type === 'checkin' &amp;&amp; task.points.shareMoment !== undefined"&gt;
            &lt;text class="points-label"&gt;分享朋友圈&lt;/text&gt;
            &lt;text class="points-value"&gt;+{{ task.points.shareMoment }}积分&lt;/text&gt;
          &lt;/view&gt;
          &lt;view class="points-item" v-if="task.points.completion !== undefined"&gt;
            &lt;text class="points-label"&gt;全部完成奖励&lt;/text&gt;
            &lt;text class="points-value"&gt;+{{ task.points.completion }}积分&lt;/text&gt;
          &lt;/view&gt;
        &lt;/view&gt;
      &lt;/view&gt;

      &lt;view class="today-card" v-if="todayTask"&gt;
        &lt;view class="today-header"&gt;
          &lt;text class="today-title"&gt;{{ todayTask.date }}&lt;/text&gt;
          &lt;view class="today-status" :class="todayTask.status"&gt;
            &lt;text&gt;{{ todayTask.statusText }}&lt;/text&gt;
          &lt;/view&gt;
        &lt;/view&gt;
      &lt;/view&gt;

      &lt;view class="records-card"&gt;
        &lt;view class="records-header"&gt;
          &lt;text class="records-title"&gt;提交记录&lt;/text&gt;
          &lt;text class="view-more" @click="goToRecords"&gt;查看全部 &gt;&lt;/text&gt;
        &lt;/view&gt;
        &lt;view class="records-list"&gt;
          &lt;SubmitRecord 
            v-for="(record, index) in recentRecords" 
            :key="index"
            :record="record"
          /&gt;
          &lt;view v-if="recentRecords.length === 0" class="no-records"&gt;
            &lt;text class="no-records-text"&gt;暂无提交记录&lt;/text&gt;
          &lt;/view&gt;
        &lt;/view&gt;
      &lt;/view&gt;
    &lt;/view&gt;

    &lt;view v-if="task" class="footer"&gt;
      &lt;view v-if="!canSubmit &amp;&amp; !canShare" class="footer-btn disabled"&gt;
        &lt;text&gt;{{ getButtonText() }}&lt;/text&gt;
      &lt;/view&gt;
      &lt;template v-else&gt;
        &lt;view v-if="canShare" class="footer-btn outline" @click="handleShare"&gt;
          &lt;text&gt;分享&lt;/text&gt;
        &lt;/view&gt;
        &lt;view v-if="canSubmit" class="footer-btn primary" @click="goToSubmit"&gt;
          &lt;text&gt;{{ task.type === 'checkin' ? '立即打卡' : '立即完成' }}&lt;/text&gt;
        &lt;/view&gt;
      &lt;/template&gt;
    &lt;/view&gt;

    &lt;SharePanel 
      v-if="showSharePanel"
      :task="task"
      :today-share-count="task.todayShareCount || 0"
      @share="confirmShare"
      @close="showSharePanel = false"
    /&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/store/task'

const taskStore = useTaskStore()

const taskId = ref('')
const showSharePanel = ref(false)

const loading = computed(() =&gt; taskStore.loading)
const task = computed(() =&gt; taskStore.currentTask)
const submitRecords = computed(() =&gt; taskStore.submitRecords)

const progressPercent = computed(() =&gt; {
  if (!task.value || task.value.totalDays === undefined) return 0
  const count = task.value.submitCount || 0
  return Math.min(100, (count / task.value.totalDays) * 100)
})

const canSubmit = computed(() =&gt; {
  if (!task.value) return false
  const now = new Date()
  const startDate = new Date(task.value.startDate)
  const endDate = new Date(task.value.endDate)
  
  if (now &lt; startDate || now &gt; endDate) return false
  if (task.value.submitCount &gt;= task.value.totalDays) return false
  
  const todaySubmit = task.value.todaySubmitCount || 0
  const maxDaily = task.value.frequency?.timesPerDay || 1
  return todaySubmit &lt; maxDaily
})

const canShare = computed(() =&gt; {
  if (!task.value) return false
  if (task.value.type === 'checkin') return true
  return task.value.submitCount &gt;= task.value.totalDays
})

const recentRecords = computed(() =&gt; {
  return submitRecords.value.slice(0, 3)
})

const todayTask = computed(() =&gt; {
  return null
})

const formatDate = (dateStr) =&gt; {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}.${day}`
}

const getButtonText = () =&gt; {
  if (!task.value) return ''
  const now = new Date()
  const startDate = new Date(task.value.startDate)
  const endDate = new Date(task.value.endDate)
  
  if (now &lt; startDate) return '未开始'
  if (now &gt; endDate) return '已结束'
  if (task.value.submitCount &gt;= task.value.totalDays) return '已完成'
  return '今日已完成'
}

const goToSubmit = () =&gt; {
  uni.navigateTo({
    url: `/pages/student/task-submit?id=${taskId.value}`
  })
}

const goToRecords = () =&gt; {
  uni.navigateTo({
    url: `/pages/student/task-records?id=${taskId.value}`
  })
}

const handleShare = () =&gt; {
  showSharePanel.value = true
}

const confirmShare = async (shareData) =&gt; {
  try {
    await taskStore.doRecordShare({
      taskId: taskId.value,
      type: shareData.type
    })
    
    showSharePanel.value = false
    
    if (shareData.points &gt; 0) {
      setTimeout(() =&gt; {
        uni.showModal({
          title: '分享成功',
          content: `+${shareData.points}积分`,
          showCancel: false
        })
      }, 500)
    } else {
      uni.showToast({
        title: '分享成功',
        icon: 'success'
      })
    }
  } catch (error) {
    console.error('分享失败', error)
  }
}

const fetchData = async () =&gt; {
  try {
    await Promise.all([
      taskStore.fetchTaskDetail(taskId.value),
      taskStore.fetchSubmitRecords(taskId.value)
    ])
  } catch (error) {
    console.error('获取数据失败', error)
  }
}

onMounted(() =&gt; {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.id) {
    taskId.value = options.id
    fetchData()
  }
})
&lt;/script&gt;

&lt;style lang="scss" scoped&gt;
@import '@/styles/variables.scss';

.task-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
  padding-bottom: 200rpx;
}

.loading-container,
.empty-container {
  padding: 200rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  font-size: $font-size-body;
  color: $color-text-placeholder;
}

.content {
  padding: $spacing-lg;
}

.info-card,
.points-card,
.today-card,
.records-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
}

.info-card {
  .info-header {
    display: flex;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
  }

  .task-type-badge {
    display: inline-flex;
    align-items: center;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;

    &amp;.homework {
      background: $color-primary-light;
      color: $color-primary;
    }

    &amp;.checkin {
      background: $color-checkin-light;
      color: $color-checkin;
    }
  }

  .task-frequency {
    display: inline-flex;
    align-items: center;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;

    &amp;.daily_once {
      background: $color-info-light;
      color: $color-info;
    }

    &amp;.daily_multi {
      background: $color-success-light;
      color: $color-success;
    }

    &amp;.weekly {
      background: rgba(168, 85, 247, 0.1);
      color: #a855f7;
    }
  }

  .task-title {
    display: block;
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $spacing-lg;
  }

  .task-meta {
    margin-bottom: $spacing-lg;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
  }

  .meta-icon {
    font-size: 28rpx;
  }

  .meta-text {
    font-size: $font-size-body;
    color: $color-text-secondary;
  }

  .progress-section {
    .progress-info {
      margin-bottom: $spacing-sm;
    }

    .progress-text {
      font-size: $font-size-body;
      color: $color-text-secondary;
    }

    .progress-bar {
      width: 100%;
      height: 12rpx;
      background: $color-border-light;
      border-radius: 999rpx;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $color-primary 0%, #ff8a5b 100%);
      border-radius: 999rpx;
      transition: width 0.3s ease;
    }
  }
}

.points-card {
  .points-header {
    margin-bottom: $spacing-lg;
  }

  .points-title {
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  .points-list {
    .points-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-sm 0;

      .points-label {
        font-size: $font-size-body;
        color: $color-text-secondary;
      }

      .points-value {
        font-size: $font-size-body;
        font-weight: $font-weight-semibold;
        color: $color-primary;
      }
    }
  }
}

.today-card {
  .today-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .today-title {
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
}

.records-card {
  .records-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;
  }

  .records-title {
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  .view-more {
    font-size: $font-size-body;
    color: $color-primary;
  }

  .no-records {
    padding: 60rpx 0;
    text-align: center;
  }

  .no-records-text {
    font-size: $font-size-body;
    color: $color-text-placeholder;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $color-bg-card;
  padding: $spacing-lg $spacing-xl;
  padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
  display: flex;
  gap: $spacing-md;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.footer-btn {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-button;
  font-size: $font-size-body;
  font-weight: $font-weight-medium;

  &amp;.primary {
    background: linear-gradient(135deg, $color-primary 0%, #ff8a5b 100%);
    color: $color-text-white;
  }

  &amp;.outline {
    background: transparent;
    border: 2rpx solid $color-border;
    color: $color-text-primary;
  }

  &amp;.disabled {
    background: $color-border-light;
    color: $color-text-placeholder;
  }
}
&lt;/style&gt;
