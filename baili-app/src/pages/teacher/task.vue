<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/store'

const taskStore = useTaskStore()
const currentTab = ref('all')
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'homework', label: '作业' },
  { key: 'checkin', label: '打卡' }
]

const tabChange = (key) => {
  currentTab.value = key
  loadTasks()
}

const loadTasks = async () => {
  const params = {}
  if (currentTab.value !== 'all') {
    params.type = currentTab.value
  }
  await taskStore.fetchTaskList(params)
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <view class="teacher-task">
    <Navbar title="任务管理" />
    
    <Tabs :tabs="tabs" :current="currentTab" @change="tabChange" />
    
    <view class="content">
      <view v-if="taskStore.taskList.length > 0" class="task-list">
        <TaskCard 
          v-for="task in taskStore.taskList" 
          :key="task.id" 
          :task="task"
        />
      </view>
      <EmptyState v-else description="暂无任务" />
    </view>
    
    <view class="fab" @tap="uni.navigateTo({ url: '/pages/teacher/task-publish' })">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.teacher-task {
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

.fab {
  position: fixed;
  right: $spacing-lg;
  bottom: 120rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-hover;
}

.fab-icon {
  font-size: 48rpx;
  color: $color-text-white;
  font-weight: $font-weight-bold;
}
</style>
