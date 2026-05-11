&lt;template&gt;
  &lt;view class="task-page"&gt;
    &lt;view class="page-header"&gt;
      &lt;text class="page-title"&gt;任务中心&lt;/text&gt;
    &lt;/view&gt;

    &lt;view class="stats-card"&gt;
      &lt;view class="stat-item"&gt;
        &lt;text class="stat-icon"&gt;📝&lt;/text&gt;
        &lt;view class="stat-info"&gt;
          &lt;text class="stat-value"&gt;{{ stats.pendingCount || 0 }}&lt;/text&gt;
          &lt;text class="stat-label"&gt;待完成&lt;/text&gt;
        &lt;/view&gt;
      &lt;/view&gt;
      &lt;view class="stat-divider"&gt;&lt;/view&gt;
      &lt;view class="stat-item"&gt;
        &lt;text class="stat-icon"&gt;🔥&lt;/text&gt;
        &lt;view class="stat-info"&gt;
          &lt;text class="stat-value"&gt;{{ stats.streakDays || 0 }}&lt;/text&gt;
          &lt;text class="stat-label"&gt;连续打卡&lt;/text&gt;
        &lt;/view&gt;
      &lt;/view&gt;
    &lt;/view&gt;

    &lt;view class="filter-tabs"&gt;
      &lt;scroll-view class="filter-scroll" scroll-x="true" show-scrollbar="false"&gt;
        &lt;view class="filter-item" 
              v-for="tab in typeTabs" 
              :key="tab.value"
              :class="{ active: currentType === tab.value }"
              @click="setTypeFilter(tab.value)"&gt;
          &lt;text&gt;{{ tab.label }}&lt;/text&gt;
        &lt;/view&gt;
      &lt;/scroll-view&gt;
    &lt;/view&gt;

    &lt;view class="filter-tabs secondary"&gt;
      &lt;scroll-view class="filter-scroll" scroll-x="true" show-scrollbar="false"&gt;
        &lt;view class="filter-item" 
              v-for="tab in statusTabs" 
              :key="tab.value"
              :class="{ active: currentStatus === tab.value }"
              @click="setStatusFilter(tab.value)"&gt;
          &lt;text&gt;{{ tab.label }}&lt;/text&gt;
        &lt;/view&gt;
      &lt;/scroll-view&gt;
    &lt;/view&gt;

    &lt;view class="task-list-container"&gt;
      &lt;view v-if="loading &amp;&amp; taskList.length === 0" class="loading-container"&gt;
        &lt;text class="loading-text"&gt;加载中...&lt;/text&gt;
      &lt;/view&gt;

      &lt;view v-else-if="filteredTasks.length === 0" class="empty-container"&gt;
        &lt;EmptyState description="暂无任务" /&gt;
      &lt;/view&gt;

      &lt;view v-else class="task-list"&gt;
        &lt;TaskCard 
          v-for="task in filteredTasks" 
          :key="task.id" 
          :task="task"
          @click="goToDetail(task)"
          @submit="handleSubmit"
          @share="handleShare"
        /&gt;
      &lt;/view&gt;
    &lt;/view&gt;

    &lt;SharePanel 
      v-if="showSharePanel"
      :task="currentShareTask"
      :today-share-count="todayShareCount"
      @share="confirmShare"
      @close="showSharePanel = false"
    /&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/store/task'

const taskStore = useTaskStore()

const currentType = ref('')
const currentStatus = ref('')
const showSharePanel = ref(false)
const currentShareTask = ref(null)
const todayShareCount = ref(0)

const typeTabs = [
  { label: '全部', value: '' },
  { label: '作业', value: 'homework' },
  { label: '打卡', value: 'checkin' }
]

const statusTabs = [
  { label: '全部', value: '' },
  { label: '进行中', value: 'active' },
  { label: '已完成', value: 'completed' }
]

const taskList = computed(() =&gt; taskStore.taskList)
const stats = computed(() =&gt; taskStore.stats)
const loading = computed(() =&gt; taskStore.loading)

const filteredTasks = computed(() =&gt; {
  return taskList.value.filter(task =&gt; {
    const typeMatch = !currentType.value || task.type === currentType.value
    const statusMatch = !currentStatus.value || getTaskStatus(task) === currentStatus.value
    return typeMatch &amp;&amp; statusMatch
  })
})

const getTaskStatus = (task) =&gt; {
  const now = new Date()
  const startDate = new Date(task.startDate)
  const endDate = new Date(task.endDate)

  if (now &lt; startDate) return 'not_started'
  if (now &gt; endDate) return 'ended'
  if (task.submitCount &gt;= task.totalDays) return 'completed'
  return 'active'
}

const setTypeFilter = (value) =&gt; {
  currentType.value = value
}

const setStatusFilter = (value) =&gt; {
  currentStatus.value = value
}

const goToDetail = (task) =&gt; {
  uni.navigateTo({
    url: `/pages/student/task-detail?id=${task.id}`
  })
}

const handleSubmit = (task) =&gt; {
  uni.navigateTo({
    url: `/pages/student/task-submit?id=${task.id}`
  })
}

const handleShare = (task) =&gt; {
  currentShareTask.value = task
  todayShareCount.value = task.todayShareCount || 0
  showSharePanel.value = true
}

const confirmShare = async (shareData) =&gt; {
  try {
    await taskStore.doRecordShare({
      taskId: shareData.task.id,
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
      taskStore.fetchTaskList(),
      taskStore.fetchStats()
    ])
  } catch (error) {
    console.error('获取数据失败', error)
  }
}

onMounted(() =&gt; {
  fetchData()
})
&lt;/script&gt;

&lt;style lang="scss" scoped&gt;
@import '@/styles/variables.scss';

.task-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.page-header {
  background: linear-gradient(135deg, $color-primary 0%, #ff8a5b 100%);
  padding: 80rpx $spacing-xl $spacing-xl;

  .page-title {
    font-size: $font-size-h1;
    font-weight: $font-weight-bold;
    color: $color-text-white;
  }
}

.stats-card {
  background: $color-bg-card;
  margin: -40rpx $spacing-lg 0;
  border-radius: $radius-card;
  padding: $spacing-xl;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: $shadow-default;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;

    .stat-icon {
      font-size: 48rpx;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-value {
        font-size: $font-size-h1;
        font-weight: $font-weight-bold;
        color: $color-primary;
      }

      .stat-label {
        font-size: $font-size-caption;
        color: $color-text-secondary;
      }
    }
  }

  .stat-divider {
    width: 2rpx;
    height: 80rpx;
    background: $color-border-light;
  }
}

.filter-tabs {
  padding: $spacing-lg 0;

  &amp;.secondary {
    padding-top: 0;
  }

  .filter-scroll {
    white-space: nowrap;
    padding: 0 $spacing-lg;
  }

  .filter-item {
    display: inline-block;
    padding: $spacing-sm $spacing-lg;
    margin-right: $spacing-md;
    border-radius: $radius-tag;
    font-size: $font-size-body;
    color: $color-text-secondary;
    background: $color-bg-card;
    transition: all 0.3s ease;

    &amp;.active {
      background: $color-primary;
      color: $color-text-white;
      font-weight: $font-weight-medium;
    }

    &amp;:last-child {
      margin-right: 0;
    }
  }
}

.task-list-container {
  padding: $spacing-lg;
  padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
}

.loading-container,
.empty-container {
  padding: 120rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  font-size: $font-size-body;
  color: $color-text-placeholder;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}
&lt;/style&gt;
