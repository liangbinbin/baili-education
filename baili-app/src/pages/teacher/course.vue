<script setup>
import { ref, onMounted } from 'vue'
import { useCourseStore } from '@/store'

const courseStore = useCourseStore()

onMounted(async () => {
  await courseStore.fetchCourseList()
})
</script>

<template>
  <view class="teacher-course">
    <Navbar title="课程管理" />
    
    <view class="content">
      <view v-if="courseStore.courseList.length > 0" class="course-list">
        <CourseCard 
          v-for="course in courseStore.courseList" 
          :key="course.id" 
          :course="course"
        />
      </view>
      <EmptyState v-else description="暂无课程" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.teacher-course {
  min-height: 100vh;
  background: $color-bg-page;
}

.content {
  padding: $spacing-lg;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}
</style>
