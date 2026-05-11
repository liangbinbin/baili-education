&lt;template&gt;
  &lt;view class="task-records-page"&gt;
    &lt;Navbar title="提交记录" /&gt;

    &lt;view v-if="loading" class="loading-container"&gt;
      &lt;text class="loading-text"&gt;加载中...&lt;/text&gt;
    &lt;/view&gt;

    &lt;view v-else-if="submitRecords.length === 0" class="empty-container"&gt;
      &lt;EmptyState description="暂无提交记录" /&gt;
    &lt;/view&gt;

    &lt;view v-else class="content"&gt;
      &lt;view class="task-summary" v-if="task"&gt;
        &lt;view class="summary-header"&gt;
          &lt;view class="task-type-badge" :class="task.type"&gt;
            &lt;text v-if="task.type === 'homework'"&gt;📝 作业&lt;/text&gt;
            &lt;text v-else&gt;🔥 打卡&lt;/text&gt;
          &lt;/view&gt;
          &lt;text class="task-title"&gt;{{ task.title }}&lt;/text&gt;
        &lt;/view&gt;
        &lt;view class="summary-stats"&gt;
          &lt;view class="stat-item"&gt;
            &lt;text class="stat-value"&gt;{{ task.submitCount || 0 }}&lt;/text&gt;
            &lt;text class="stat-label"&gt;已提交&lt;/text&gt;
          &lt;/view&gt;
          &lt;view class="stat-divider"&gt;&lt;/view&gt;
          &lt;view class="stat-item"&gt;
            &lt;text class="stat-value"&gt;{{ task.totalDays || 0 }}&lt;/text&gt;
            &lt;text class="stat-label"&gt;总天数&lt;/text&gt;
          &lt;/view&gt;
        &lt;/view&gt;
      &lt;/view&gt;

      &lt;view class="records-list"&gt;
        &lt;view class="record-card" v-for="(record, index) in submitRecords" :key="index"&gt;
          &lt;view class="record-header"&gt;
            &lt;view class="record-date"&gt;
              &lt;text class="date-text"&gt;{{ formatDate(record.createdAt || record.date) }}&lt;/text&gt;
              &lt;text v-if="record.time" class="time-text"&gt;{{ record.time }}&lt;/text&gt;
            &lt;/view&gt;
            &lt;view class="record-status" :class="record.status || 'completed'"&gt;
              &lt;text&gt;{{ getStatusText(record.status) }}&lt;/text&gt;
            &lt;/view&gt;
          &lt;/view&gt;

          &lt;view v-if="record.files &amp;&amp; record.files.length &gt; 0" class="record-files"&gt;
            &lt;view class="file-item" v-for="(file, fIndex) in record.files" :key="fIndex"&gt;
              &lt;text class="file-icon"&gt;{{ getFileIcon(file.type) }}&lt;/text&gt;
              &lt;text class="file-name"&gt;{{ file.name || getFileName(file) }}&lt;/text&gt;
            &lt;/view&gt;
          &lt;/view&gt;

          &lt;view v-if="record.content" class="record-content"&gt;
            &lt;text&gt;{{ record.content }}&lt;/text&gt;
          &lt;/view&gt;

          &lt;view class="record-footer"&gt;
            &lt;text v-if="record.points || record.earnedPoints" class="record-points"&gt;
              +{{ record.points || record.earnedPoints }}积分
            &lt;/text&gt;
          &lt;/view&gt;

          &lt;view v-if="record.gradedPoints !== undefined" class="record-grade"&gt;
            &lt;view class="grade-divider"&gt;&lt;/view&gt;
            &lt;view class="grade-info"&gt;
              &lt;text class="grade-label"&gt;老师评价&lt;/text&gt;
              &lt;text class="grade-points"&gt;获得积分：{{ record.gradedPoints }}/{{ record.points || 100 }}&lt;/text&gt;
            &lt;/view&gt;
            &lt;text v-if="record.comment" class="grade-comment"&gt;{{ record.comment }}&lt;/text&gt;
          &lt;/view&gt;
        &lt;/view&gt;
      &lt;/view&gt;
    &lt;/view&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/store/task'

const taskStore = useTaskStore()
const taskId = ref('')

const loading = computed(() =&gt; taskStore.loading)
const task = computed(() =&gt; taskStore.currentTask)
const submitRecords = computed(() =&gt; taskStore.submitRecords)

const formatDate = (dateStr) =&gt; {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}.${day} ${hours}:${minutes}`
}

const getStatusText = (status) =&gt; {
  if (status === 'graded') return '已批改'
  if (status === 'pending') return '待批改'
  return '已提交'
}

const getFileIcon = (type) =&gt; {
  if (type?.includes('video') || type === 'video') return '🎬'
  if (type?.includes('audio') || type === 'audio') return '🎵'
  if (type?.includes('image') || type === 'image') return '🖼️'
  return '📄'
}

const getFileName = (file) =&gt; {
  if (file.name) return file.name
  if (file.url) {
    const parts = file.url.split('/')
    return parts[parts.length - 1] || '文件'
  }
  return '文件'
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

.task-records-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
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
  padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
}

.task-summary {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
}

.summary-header {
  margin-bottom: $spacing-lg;
}

.task-type-badge {
  display: inline-flex;
  align-items: center;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-tag;
  font-size: $font-size-caption;
  font-weight: $font-weight-medium;
  margin-bottom: $spacing-md;

  &amp;.homework {
    background: $color-primary-light;
    color: $color-primary;
  }

  &amp;.checkin {
    background: $color-checkin-light;
    color: $color-checkin;
  }
}

.task-title {
  display: block;
  font-size: $font-size-h2;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.summary-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-xl;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.stat-value {
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.stat-label {
  font-size: $font-size-caption;
  color: $color-text-secondary;
}

.stat-divider {
  width: 2rpx;
  height: 80rpx;
  background: $color-border-light;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.record-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.record-date {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.date-text {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.time-text {
  font-size: $font-size-caption;
  color: $color-text-secondary;
}

.record-status {
  display: inline-flex;
  align-items: center;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-tag;
  font-size: $font-size-caption;
  font-weight: $font-weight-medium;

  &amp;.completed {
    background: $color-success-light;
    color: $color-success;
  }

  &amp;.pending {
    background: $color-warning-light;
    color: $color-warning;
  }

  &amp;.graded {
    background: $color-primary-light;
    color: $color-primary;
  }
}

.record-files {
  margin-bottom: $spacing-md;
}

.file-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm 0;
}

.file-icon {
  font-size: 36rpx;
}

.file-name {
  font-size: $font-size-body;
  color: $color-text-primary;
}

.record-content {
  margin-bottom: $spacing-md;
  font-size: $font-size-body;
  color: $color-text-secondary;
  line-height: 1.6;
}

.record-footer {
  padding-bottom: $spacing-sm;
}

.record-points {
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.record-grade {
  padding-top: $spacing-lg;
}

.grade-divider {
  width: 100%;
  height: 2rpx;
  background: $color-border-light;
  margin-bottom: $spacing-lg;
}

.grade-info {
  margin-bottom: $spacing-sm;
}

.grade-label {
  display: block;
  font-size: $font-size-body;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  margin-bottom: $spacing-xs;
}

.grade-points {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.grade-comment {
  font-size: $font-size-body;
  color: $color-text-secondary;
  line-height: 1.6;
}
&lt;/style&gt;
