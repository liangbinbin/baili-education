<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore, useTaskStore, useCourseStore } from '@/store'

const userStore = useUserStore()
const taskStore = useTaskStore()
const courseStore = useCourseStore()

const stats = ref({
  totalStudents: 0,
  pendingTasks: 0,
  todayClasses: 0,
  totalPoints: 0
})

const quickActions = [
  { icon: '📝', title: '发布任务', path: '/pages/teacher/task-publish' },
  { icon: '✅', title: '批改任务', path: '/pages/teacher/task-grade' },
  { icon: '📅', title: '排课管理', path: '/pages/teacher/schedule' },
  { icon: '⭐', title: '积分管理', path: '/pages/teacher/points' }
]

const recentTasks = ref([])

onMounted(async () => {
  await Promise.all([
    userStore.fetchUserInfo(),
    taskStore.fetchTaskList({ status: 'pending' }),
    courseStore.fetchCourseList()
  ])
  recentTasks.value = taskStore.taskList.slice(0, 3)
})
</script>

<template>
  <view class="teacher-home">
    <view class="header">
      <view class="user-info">
        <view class="avatar">
          <text>{{ userStore.userInfo?.name?.charAt(0) || '教' }}</text>
        </view>
        <view class="info">
          <text class="name">{{ userStore.userInfo?.name || '教师' }}</text>
          <text class="role">教师</text>
        </view>
      </view>
    </view>

    <view class="stats-card card">
      <view class="stat-item">
        <text class="stat-value">{{ stats.totalStudents }}</text>
        <text class="stat-label">学员总数</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.pendingTasks }}</text>
        <text class="stat-label">待批改</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.todayClasses }}</text>
        <text class="stat-label">今日课程</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">快捷操作</text>
      <view class="quick-actions">
        <view 
          v-for="(action, index) in quickActions" 
          :key="index"
          class="action-item"
          @tap="uni.navigateTo({ url: action.path })"
        >
          <text class="action-icon">{{ action.icon }}</text>
          <text class="action-title">{{ action.title }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">待批改任务</text>
        <text class="section-more" @tap="uni.navigateTo({ url: '/pages/teacher/task-grade' })">查看全部</text>
      </view>
      <view v-if="recentTasks.length > 0" class="task-list">
        <view v-for="task in recentTasks" :key="task.id" class="task-item card">
          <view class="task-info">
            <text class="task-title">{{ task.title }}</text>
            <text class="task-class">{{ task.className }}</text>
            <text class="task-meta">{{ task.submittedCount }}/{{ task.totalCount }} 已提交</text>
          </view>
          <text class="task-tag tag-warning">待批改</text>
        </view>
      </view>
      <EmptyState v-else description="暂无待批改任务" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.teacher-home {
  min-height: 100vh;
  background: $color-bg-page;
}

.header {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  padding: 80rpx $spacing-lg $spacing-xl;
  color: $color-text-white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
}

.info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.name {
  font-size: $font-size-h2;
  font-weight: $font-weight-semibold;
}

.role {
  font-size: $font-size-caption;
  opacity: 0.9;
}

.stats-card {
  margin: -40rpx $spacing-lg 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: $spacing-xl $spacing-lg;
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
  width: 1px;
  height: 60rpx;
  background: $color-border;
}

.section {
  padding: $spacing-lg;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.section-more {
  font-size: $font-size-caption;
  color: $color-primary;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-lg $spacing-sm;
}

.action-icon {
  font-size: 48rpx;
}

.action-title {
  font-size: $font-size-caption;
  color: $color-text-secondary;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  flex: 1;
}

.task-title {
  font-size: $font-size-body;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.task-class {
  font-size: $font-size-caption;
  color: $color-text-secondary;
}

.task-meta {
  font-size: $font-size-mini;
  color: $color-text-placeholder;
}

.task-tag {
  flex-shrink: 0;
}
</style>
