<template>
  <view class="course-page">
    <Navbar title="我的课程" />

    <scroll-view class="tab-scroll" scroll-x="true" show-scrollbar="false">
      <view class="tab-list">
        <view
          class="tab-item"
          :class="{ active: activeTab === item.value }"
          v-for="item in tabs"
          :key="item.value"
          @click="activeTab = item.value"
        >
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

    <view class="course-list">
      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :cover="course.cover"
        :title="course.title"
        :level="course.level"
        :lessons="course.lessons"
        :preview-classes="course.previewClasses"
        :more-classes="course.moreClasses"
        :status="course.status"
        @click="goToDetail(course.id)"
      />
      <EmptyState v-if="filteredCourses.length === 0" description="暂无课程" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCourseList } from '@/api/course'

const activeTab = ref('all')

const tabs = [
  { label: '全部', value: 'all' },
  { label: '报名中', value: 'enrolling' },
  { label: '进行中', value: 'ongoing' },
  { label: '已结课', value: 'finished' }
]

const courseList = ref([
  {
    id: 1,
    title: '演讲基础',
    level: '入门级',
    lessons: 24,
    previewClasses: ['基础1班', '基础2班'],
    moreClasses: 3,
    status: 'ongoing',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20speech%20training%20course%20cover&image_size=square'
  },
  {
    id: 2,
    title: '演讲进阶',
    level: '进阶级',
    lessons: 32,
    previewClasses: ['进阶1班'],
    moreClasses: 1,
    status: 'ongoing',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=public%20speaking%20course%20cover&image_size=square'
  },
  {
    id: 3,
    title: '主持人培训',
    level: '高级',
    lessons: 40,
    previewClasses: [],
    moreClasses: 0,
    status: 'enrolling',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=host%20training%20course%20cover&image_size=square'
  }
])

const filteredCourses = computed(() => {
  if (activeTab.value === 'all') {
    return courseList.value
  }
  return courseList.value.filter(course => course.status === activeTab.value)
})

const loadCourses = async () => {
  try {
    const data = await getCourseList({ status: activeTab.value })
    if (data && data.length > 0) {
      courseList.value = data
    }
  } catch (error) {
    console.error('获取课程列表失败', error)
  }
}

onMounted(() => {
  loadCourses()
})

const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/student/course-detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.course-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
}

.tab-scroll {
  background: $color-bg-card;
  white-space: nowrap;
  padding: 0 $spacing-lg;

  .tab-list {
    display: inline-flex;
    gap: $spacing-xl;
    padding: $spacing-md 0;

    .tab-item {
      font-size: $font-size-body;
      color: $color-text-secondary;
      padding: $spacing-xs 0;
      position: relative;
      white-space: nowrap;

      &.active {
        color: $color-primary;
        font-weight: $font-weight-semibold;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 6rpx;
          background: $color-primary;
          border-radius: 3rpx;
        }
      }
    }
  }
}

.course-list {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}
</style>
