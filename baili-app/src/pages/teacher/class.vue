<script setup>
import { ref, onMounted } from 'vue'
import { useCourseStore } from '@/store'

const courseStore = useCourseStore()

onMounted(async () => {
  await courseStore.fetchCourseList()
})
</script>

<template>
  <view class="teacher-class">
    <Navbar title="班级管理" />
    
    <view class="content">
      <view v-if="courseStore.courseList.length > 0" class="class-list">
        <view v-for="course in courseStore.courseList" :key="course.id" class="class-item card">
          <view class="class-header">
            <text class="class-name">{{ course.name }}</text>
            <text class="class-count">{{ course.studentCount || 0 }}人</text>
          </view>
          <view class="class-info">
            <text class="info-item">课程：{{ course.name }}</text>
            <text class="info-item">教师：{{ course.teacherName || '未分配' }}</text>
          </view>
        </view>
      </view>
      <EmptyState v-else description="暂无班级" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.teacher-class {
  min-height: 100vh;
  background: $color-bg-page;
}

.content {
  padding: $spacing-lg;
}

.class-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.class-item {
  padding: $spacing-lg;
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.class-name {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.class-count {
  font-size: $font-size-caption;
  color: $color-primary;
}

.class-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.info-item {
  font-size: $font-size-body-sm;
  color: $color-text-secondary;
}
</style>
