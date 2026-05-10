<template>
  <view class="task-page">
    <view class="header">
      <text class="title">任务</text>
    </view>

    <Tabs :tabs="tabs" v-model:activeTab="activeTab" />

    <view class="task-list">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @click="goToDetail(task.id)"
      />
      <EmptyState v-if="filteredTasks.length === 0" :description="activeTab === 'pending' ? '暂无待完成任务' : '暂无已完成任务'" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('pending')

const tabs = [
  { label: '待完成', value: 'pending' },
  { label: '已完成', value: 'completed' }
]

const taskList = ref([
  {
    id: 1,
    title: '《演讲与口才》第3课作业',
    type: 'homework',
    deadline: '2024-01-15 23:59',
    status: 'pending',
    points: 20
  },
  {
    id: 2,
    title: '今日打卡：绕口令练习',
    type: 'checkin',
    deadline: '2024-01-12 23:59',
    status: 'pending',
    points: 10
  },
  {
    id: 3,
    title: '上周作业：自我介绍视频',
    type: 'homework',
    deadline: '2024-01-08 23:59',
    status: 'completed',
    points: 25,
    gradedPoints: 23,
    comment: '表现很棒！'
  }
])

const filteredTasks = computed(() => {
  return taskList.value.filter(task => {
    if (activeTab.value === 'pending') {
      return task.status === 'pending'
    }
    return task.status === 'completed'
  })
})

const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/student/task-detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.task-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.header {
  background: linear-gradient(135deg, $color-primary 0%, #FF8A5B 100%);
  padding: 80rpx $spacing-xl $spacing-xl;

  .title {
    font-size: $font-size-h1;
    font-weight: $font-weight-bold;
    color: $color-text-white;
  }
}

.task-list {
  padding: $spacing-lg;
}
</style>
