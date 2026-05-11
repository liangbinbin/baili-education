<template>
  <view class="course-detail-page">
    <Navbar title="课程详情" />

    <view class="cover-section">
      <image class="cover" :src="course.cover" mode="aspectFill" />
      <view class="cover-info">
        <text class="course-title">{{ course.title }}</text>
        <view class="course-meta">
          <text class="meta-item">{{ course.level }}</text>
          <text class="meta-item">·</text>
          <text class="meta-item">{{ course.lessons }}课时</text>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="intro-section">
        <view class="section-title">课程介绍</view>
        <text class="intro-text">{{ course.description }}</text>
      </view>

      <view class="classes-section">
        <view class="section-title">班级列表</view>
        <view class="class-list">
          <ClassCard
            v-for="cls in course.classes"
            :key="cls.id"
            :title="cls.title"
            :teacher="cls.teacher"
            :student-count="cls.studentCount"
            :schedule="cls.schedule"
            :status="cls.status"
            @click="goToClassDetail(cls.id)"
          />
        </view>
        <EmptyState v-if="course.classes.length === 0" description="暂无班级" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCourseDetail } from '@/api/course'

const courseId = ref('')

const course = ref({
  id: 1,
  title: '演讲基础',
  level: '入门级',
  lessons: 24,
  cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20speech%20training%20course%20cover&image_size=square',
  description: '专为青少儿设计的演讲基础课程，通过系统化训练帮助孩子建立自信，提升表达能力。课程内容丰富有趣，让孩子在快乐中学习成长。',
  classes: [
    {
      id: 1,
      title: '演讲基础1班',
      teacher: '李老师',
      studentCount: 20,
      schedule: '周六 10:00-11:30',
      status: 'ongoing'
    },
    {
      id: 2,
      title: '演讲基础2班',
      teacher: '王老师',
      studentCount: 18,
      schedule: '周日 14:00-15:30',
      status: 'ongoing'
    }
  ]
})

const loadCourseDetail = async () => {
  try {
    const data = await getCourseDetail(courseId.value)
    if (data) {
      course.value = data
    }
  } catch (error) {
    console.error('获取课程详情失败', error)
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.id) {
    courseId.value = options.id
    loadCourseDetail()
  }
})

const goToClassDetail = (id) => {
  uni.navigateTo({ url: `/pages/student/class-detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.course-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
  padding-bottom: 40rpx;
}

.cover-section {
  position: relative;
  background: $color-bg-card;
  margin-bottom: $spacing-lg;

  .cover {
    width: 100%;
    height: 400rpx;
  }

  .cover-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    padding: $spacing-xl $spacing-lg;

    .course-title {
      font-size: $font-size-h1;
      font-weight: $font-weight-bold;
      color: $color-text-white;
      display: block;
      margin-bottom: $spacing-sm;
    }

    .course-meta {
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      .meta-item {
        font-size: $font-size-body;
        color: rgba(255,255,255,0.9);
      }
    }
  }
}

.content {
  padding: 0 $spacing-lg;
}

.intro-section,
.classes-section {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;

  .section-title {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $spacing-md;
  }
}

.intro-text {
  font-size: $font-size-body;
  color: $color-text-secondary;
  line-height: 1.6;
}

.class-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}
</style>
