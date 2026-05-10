<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/store'

const taskStore = useTaskStore()

onMounted(async () => {
  await taskStore.fetchTaskList({ status: 'submitted' })
})

const gradeTask = (taskId) => {
  uni.showModal({
    title: '批改任务',
    editable: true,
    placeholderText: '请输入评语',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '批改成功' })
      }
    }
  })
}
</script>

<template>
  <view class="task-grade">
    <Navbar title="批改任务" />
    
    <view class="content">
      <view v-if="taskStore.taskList.length > 0" class="task-list">
        <view v-for="task in taskStore.taskList" :key="task.id" class="task-item card">
          <view class="task-header">
            <text class="task-title">{{ task.title }}</text>
            <text class="task-tag tag-warning">待批改</text>
          </view>
          <view class="task-info">
            <text class="info-text">学员：{{ task.studentName }}</text>
            <text class="info-text">提交时间：{{ task.submitTime }}</text>
            <text class="info-text">班级：{{ task.className }}</text>
          </view>
          <view class="task-actions">
            <Button size="small" @tap="uni.navigateTo({ url: '/pages/student/task-detail?id=' + task.id })">查看详情</Button>
            <Button type="primary" size="small" @tap="gradeTask(task.id)">批改</Button>
          </view>
        </view>
      </view>
      <EmptyState v-else description="暂无待批改任务" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.task-grade {
  min-height: 100vh;
  background: $color-bg-page;
}

.content {
  padding: $spacing-lg;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.task-item {
  padding: $spacing-lg;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.task-title {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-bottom: $spacing-lg;
}

.info-text {
  font-size: $font-size-body-sm;
  color: $color-text-secondary;
}

.task-actions {
  display: flex;
  gap: $spacing-md;
}
</style>
